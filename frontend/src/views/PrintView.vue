<template>
  <div class="print-page-container">
    <header class="print-header">
      <h1>✨ Друк магічної поліграфії ✨</h1>
      <p class="instruction">
        Створюйте власні карти, плакати та сувої. Надішліть свій макет на нашу пошту:
        <a href="mailto:lunashoppoligrafy@gmail.com" class="email-link">lunashoppoligrafy@gmail.com</a>
      </p>
    </header>

    <div class="print-split-content">
      <!-- Ліва колонка: Доступні формати -->
      <section class="formats-section">
        <h2>Доступні формати друку</h2>
        
        <div class="formats-grid">
          <!-- Формат A4 -->
          <div class="format-info-card card-tarot-style">
            <span class="format-badge">A4</span>
            <div class="format-details">
              <h3>Стандартний плакат (A4)</h3>
              <p>Оптимальний розмір для художніх ілюстрацій, сторінок грімуарів та заклинань. Друк на щільному матовому папері.</p>
              <span class="price-estimate">Ціна: від 20 грн / шт</span>
            </div>
          </div>

          <!-- Формат A5 -->
          <div class="format-info-card card-tarot-style">
            <span class="format-badge">A5</span>
            <div class="format-details">
              <h3>Магічна листівка (A5)</h3>
              <p>Чудовий варіант для вітальних карток, міні-принтів, амулетів та ескізів. Зручно дарувати та зберігати.</p>
              <span class="price-estimate">Ціна: від 10 грн / шт</span>
            </div>
          </div>

          <!-- Формат A3 -->
          <div class="format-info-card card-tarot-style">
            <span class="format-badge">A3</span>
            <div class="format-details">
              <h3>Великий постер (A3)</h3>
              <p>Для деталізованих карт зоряного неба, генеалогічних дерев та великих постерів. Максимальна чіткість.</p>
              <span class="price-estimate">Ціна: від 45 грн / шт</span>
            </div>
          </div>

          <!-- Наліпки -->
          <div class="format-info-card card-tarot-style">
            <span class="format-badge">STICK</span>
            <div class="format-details">
              <h3>Сет магічних наліпок</h3>
              <p>Листи з круглими або фігурними наліпками на самоклейці. Прикрасьте свій блокнот або лептоп.</p>
              <span class="price-estimate">Ціна: від 30 грн / лист</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Права колонка: Форма замовлення -->
      <section class="print-form-section card-tarot-style">
        <h2>Заявка на друк</h2>
        
        <form @submit.prevent="submitForm" class="print-form">
          <div class="form-group">
            <label for="name">Ваше Ім'я</label>
            <input type="text" id="name" v-model="formData.name" placeholder="Як вас звати?" maxlength="30" required />
          </div>

          <div class="form-group">
            <label for="email">Ваш Email</label>
            <input type="email" id="email" v-model="formData.email" placeholder="example@mail.com" maxlength="30" required />
            <small>Надсилайте файл з цієї ж адреси для підтвердження.</small>
          </div>

          <div class="form-group">
            <label for="format">Оберіть формат</label>
            <select id="format" v-model="formData.format" required>
              <option value="" disabled>Оберіть формат</option>
              <option value="A4">A4 (Стандартний плакат)</option>
              <option value="A5">A5 (Листівка)</option>
              <option value="A3">A3 (Великий постер)</option>
              <option value="Square Stickers">Сет магічних наліпок</option>
            </select>
          </div>

          <div class="form-group">
            <label for="details">Додаткові параметри (побажання)</label>
            <textarea 
              id="details" 
              v-model="formData.details" 
              placeholder="Наприклад: матовий папір, кількість екземплярів, щільність..."
              maxlength="500"
              rows="4"
            ></textarea>
          </div>

          <button type="submit" class="submit-btn">
            Надіслати сову з заявкою ✨
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import api from '../api';

const formData = reactive({
  name: '',
  email: '',
  format: '',
  details: ''
});

const submitForm = async () => {
  try {
    const orderData = {
      email: formData.email,
      service_type: `Друк: ${formData.format} (Замовник: ${formData.name})`,
      details: formData.details
    };

    const response = await api.post('/api/orders/printing', orderData);

    if (response.status === 200 || response.status === 201) {
      alert(`Дякуємо, ${formData.name}! Ваша заявка занесена в базу. Тепер надішліть ваш макет на пошту.`);
      
      // Очищуємо форму
      formData.name = '';
      formData.email = '';
      formData.format = '';
      formData.details = '';
    }
  } catch (error) {
    console.error('Помилка відправки:', error);
    alert('Помилка з\'єднання з сервером. Перевірте, чи запущений backend!');
  }
};
</script>

<style scoped>
.print-page-container {
  max-width: 1400px;
  margin: 0 auto;
  color: white;
}

.print-header {
  text-align: center;
  margin-bottom: 40px;
}

.print-header h1 {
  font-family: 'Cinzel', serif;
  color: #e0aaff;
  font-size: 2.5rem;
  margin-bottom: 15px;
  text-shadow: 0 0 15px rgba(224, 170, 255, 0.4);
}

.instruction {
  font-size: 1.1rem;
  color: #b39ddb;
  line-height: 1.6;
}

.email-link {
  color: #c5a059;
  font-weight: bold;
  text-decoration: underline;
}

/* Спліт-сітка */
.print-split-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  align-items: stretch;
}

@media (max-width: 992px) {
  .print-split-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

.formats-section h2, .print-form-section h2 {
  font-family: 'Cinzel', serif;
  color: #c5a059;
  font-size: 1.6rem;
  margin-bottom: 25px;
}

/* Список форматів друку */
.formats-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.format-info-card {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: rgba(30, 11, 54, 0.6);
  border-radius: 12px;
  border: 1px solid #7b2cbf;
  text-align: left;
  transition: transform 0.3s, box-shadow 0.3s;
}

.format-info-card:hover {
  transform: translateX(5px);
  box-shadow: 0 0 15px rgba(123, 44, 191, 0.3);
}

.format-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background: #1a0b2e;
  border: 2px solid #c5a059;
  border-radius: 8px;
  font-family: 'Cinzel', serif;
  font-weight: bold;
  color: #c5a059;
  font-size: 1.1rem;
  flex-shrink: 0;
  text-shadow: 0 0 5px rgba(197, 160, 89, 0.5);
}

.format-details h3 {
  margin: 0 0 8px 0;
  font-size: 1.15rem;
  color: white;
}

.format-details p {
  margin: 0 0 10px 0;
  color: #b39ddb;
  font-size: 0.9rem;
  line-height: 1.5;
}

.price-estimate {
  font-weight: bold;
  color: #ff9e00;
  font-size: 0.95rem;
}

/* Секція форми */
.print-form-section {
  background: rgba(30, 11, 54, 0.9);
  padding: 30px;
  border-radius: 15px;
  border: 1px solid #7b2cbf;
}

.print-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 500;
  color: #e9d5ff;
}

input, select, textarea {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #4c1d95;
  background: #1a0b2e;
  color: white;
  outline: none;
  font-family: inherit;
  transition: all 0.3s;
}

input:focus, select:focus, textarea:focus {
  border-color: #c5a059;
  box-shadow: 0 0 8px rgba(197, 160, 89, 0.4);
}

small {
  font-size: 0.8rem;
  color: #94a3b8;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(45deg, #6d28d9, #9333ea);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-size: 1rem;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(147, 51, 234, 0.4);
}
</style>