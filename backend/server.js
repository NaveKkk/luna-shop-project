const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000; 

// Налаштування Middlewares
app.use(cors());
app.use(bodyParser.json());

// --- РОБОТА З БАЗОЮ ДАНИХ ---

const db = new sqlite3.Database('./magic_shop.db', (err) => {
    if (err) {
        console.error('Помилка відкриття БД:', err.message);
    } else {
        console.log('Магічна база даних підключена успішно!');
    }
});

db.serialize(() => {
    // 1. Книги (Товари)
    db.run(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        price REAL,
        image TEXT,
        description TEXT
    )`);

    // 2. Замовлення поліграфії (з PrintView.vue)
    db.run(`CREATE TABLE IF NOT EXISTS printing_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        service_type TEXT,
        details TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 3. Замовлення з магазину/кошика (з CartView.vue)
    db.run(`CREATE TABLE IF NOT EXISTS shop_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_email TEXT,
        items_json TEXT, -- Список товарів у форматі JSON
        total_price REAL,
        status TEXT DEFAULT 'processing',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 4. Промокоди (для гри Таро)
    db.run(`CREATE TABLE IF NOT EXISTS promocodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE,
        discount INTEGER,
        is_used INTEGER DEFAULT 0
    )`);

    // 5. Відгуки
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT,
        rating INTEGER,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// --- API МАРШРУТИ ---

app.get('/', (req, res) => {
    res.send('Магічний сервер диплому працює! ✨');
});

// --- РОБОТА З КНИГАМИ ---
app.get('/api/books', (req, res) => {
    db.all("SELECT * FROM books", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- РОБОТА З ПОЛІГРАФІЄЮ (OrdersView + PrintView) ---

// Отримати всі замовлення на друк (для OrdersView.vue)
app.get('/api/orders/printing', (req, res) => {
    db.all("SELECT * FROM printing_orders ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Створити нове замовлення на друк (з PrintView.vue)
app.post('/api/orders/printing', (req, res) => {
    const { email, service_type, details } = req.body;
    const sql = `INSERT INTO printing_orders (email, service_type, details) VALUES (?, ?, ?)`;
    db.run(sql, [email, service_type, details], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: "Замовлення на друк прийнято!" });
    });
});

// --- РОБОТА З КОШИКОМ (Оформлення покупок) ---

app.post('/api/orders/shop', (req, res) => {
    const { email, items, total, promocode } = req.body;
    const itemsString = JSON.stringify(items);
    
    db.serialize(() => {
        const sql = `INSERT INTO shop_orders (customer_email, items_json, total_price) VALUES (?, ?, ?)`;
        db.run(sql, [email, itemsString, total], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            const orderId = this.lastID;
            if (promocode) {
                // Позначаємо промокод як використаний
                db.run(`UPDATE promocodes SET is_used = 1 WHERE code = ?`, [promocode], (promoErr) => {
                    if (promoErr) {
                        console.error('Помилка оновлення статусу промокоду:', promoErr.message);
                    }
                    res.json({ id: orderId, message: "Покупка оформлена успішно!" });
                });
            } else {
                res.json({ id: orderId, message: "Покупка оформлена успішно!" });
            }
        });
    });
});

// Отримати покупки магазину (для OrdersView.vue)
app.get('/api/orders/shop', (req, res) => {
    db.all("SELECT * FROM shop_orders ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Перетворюємо JSON-рядок назад у масив об'єктів для фронтенду
        const formattedRows = rows.map(row => ({
            ...row,
            items: JSON.parse(row.items_json)
        }));
        res.json(formattedRows);
    });
});

// --- ПРОМОКОДИ (Гра Таро) ---

app.post('/api/promocodes/generate', (req, res) => {
    const discount = req.body.discount || 15;
    const code = 'MAGIC' + Math.floor(10000 + Math.random() * 90000); // 5-значний унікальний код
    db.run(`INSERT INTO promocodes (code, discount) VALUES (?, ?)`, [code, discount], function(err) {
        if (err) {
            const retryCode = 'MAGIC' + Math.floor(10000 + Math.random() * 90000);
            db.run(`INSERT INTO promocodes (code, discount) VALUES (?, ?)`, [retryCode, discount], (err2) => {
                if (err2) return res.status(500).json({ error: "Не вдалося створити промокод" });
                res.json({ code: retryCode, discount });
            });
        } else {
            res.json({ code, discount });
        }
    });
});

// Перевірка та валідація промокоду
app.post('/api/promocodes/validate', (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: "Вкажіть промокод" });
    }
    db.get("SELECT * FROM promocodes WHERE code = ?", [code], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) {
            return res.status(404).json({ error: "Такого магічного сувою (промокоду) не існує" });
        }
        if (row.is_used === 1) {
            return res.status(400).json({ error: "Цей промокод вже був використаний і більше не діє!" });
        }
        res.json({ valid: true, discount: row.discount });
    });
});

// --- ВІДГУКИ ---

app.get('/api/reviews', (req, res) => {
    db.all("SELECT * FROM reviews ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/reviews', (req, res) => {
    const { user_name, rating, comment } = req.body;
    db.run(`INSERT INTO reviews (user_name, rating, comment) VALUES (?, ?, ?)`, 
    [user_name, rating, comment], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

// Видалення замовлення магазину
app.delete('/api/orders/shop/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM shop_orders WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Замовлення магазину видалено!" });
    });
});

// Видалення замовлення друку
app.delete('/api/orders/printing/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM printing_orders WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Замовлення друку видалено!" });
    });
});

// Видалення відгуку
app.delete('/api/reviews/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM reviews WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Відгук видалено!" });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на: http://localhost:${PORT}`);
});