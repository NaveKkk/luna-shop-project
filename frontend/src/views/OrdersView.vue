<template>
  <div class="orders-page">
    <h1 class="page-title">Ваші Магічні Замовлення</h1>

    <!-- Перемикач вкладок -->
    <div class="tabs-container">
      <button 
        :class="['tab-btn', { active: currentTab === 'shop' }]" 
        @click="currentTab = 'shop'"
      >
        🔮 Замовлення Магазину
      </button>
      <button 
        :class="['tab-btn', { active: currentTab === 'print' }]" 
        @click="currentTab = 'print'"
      >
        📜 Замовлення Друку
      </button>
    </div>
    
    <div v-if="loading" class="loader">Зчитуємо сувої замовлень...</div>
    
    <div v-else>
      <!-- Вкладка замовлень магазину -->
      <div v-if="currentTab === 'shop'">
        <div v-if="shopOrders.length === 0" class="no-orders">
          <p>Ви ще не зробили жодного замовлення у нашому магазині.</p>
          <router-link to="/shop" class="go-shop">Відвідати магазин</router-link>
        </div>
        
        <div v-else class="orders-list">
          <div v-for="order in shopOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <span class="order-number">Замовлення №{{ order.id }}</span>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span :class="['status-badge', order.status]">{{ order.status }}</span>
                <button @click="deleteShopOrder(order.id)" class="delete-btn-cross" title="Видалити замовлення">×</button>
              </div>
            </div>
            
            <div class="order-body">
              <p><strong>Пошта покупця:</strong> {{ order.customer_email }}</p>
              
              <div class="items-list-container">
                <strong>Товари:</strong>
                <ul class="items-list">
                  <li v-for="(item, idx) in formatItems(order.items)" :key="idx">
                    ✨ {{ item }}
                  </li>
                </ul>
              </div>
              
              <div class="price-section">
                <strong>Загальна вартість:</strong> <span class="total-price-value">{{ order.total_price }} грн</span>
              </div>
              
              <div class="date-note">
                📅 Створено: {{ formatDate(order.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Вкладка замовлень друку -->
      <div v-if="currentTab === 'print'">
        <div v-if="printOrders.length === 0" class="no-orders">
          <p>Ви ще не надіслали жодного файлу на магічний друк.</p>
          <router-link to="/print" class="go-shop">Замовити друк</router-link>
        </div>
        
        <div v-else class="orders-list">
          <div v-for="order in printOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <span class="order-number">Друк №{{ order.id }}</span>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span :class="['status-badge', order.status]">{{ order.status }}</span>
                <button @click="deletePrintOrder(order.id)" class="delete-btn-cross" title="Видалити замовлення">×</button>
              </div>
            </div>
            
            <div class="order-body">
              <p><strong>Послуга:</strong> {{ order.service_type }}</p>
              <p><strong>Контакт:</strong> {{ order.email }}</p>
              <p v-if="order.details"><strong>Деталі замовлення:</strong> {{ order.details }}</p>
              
              <div class="price-note">
                <i class="fas fa-info-circle"></i> 
                Орієнтовна вартість друку: від 10 до 50 грн за екземпляр (залежно від параметрів).
              </div>
              
              <div class="date-note">
                📅 Створено: {{ formatDate(order.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const currentTab = ref('shop'); // 'shop' або 'print'
const shopOrders = ref([]);
const printOrders = ref([]);
const loading = ref(true);

const fetchOrders = async () => {
  loading.value = true;
  try {
    // Паралельно завантажуємо обидва види замовлень з правильного порту 3000
    const [shopRes, printRes] = await Promise.all([
      api.get('/api/orders/shop'),
      api.get('/api/orders/printing')
    ]);
    
    shopOrders.value = shopRes.data;
    printOrders.value = printRes.data;
  } catch (error) {
    console.error("Помилка завантаження замовлень:", error);
  } finally {
    loading.value = false;
  }
};

const formatItems = (items) => {
  if (Array.isArray(items)) {
    return items.map(item => {
      if (typeof item === 'object' && item !== null) {
        return `${item.name} (x${item.quantity || 1}) - ${item.price} грн`;
      }
      return String(item);
    });
  }
  if (typeof items === 'string') {
    try {
      const parsed = JSON.parse(items);
      if (Array.isArray(parsed)) {
        return formatItems(parsed);
      }
    } catch (e) {
      // ignore JSON parse error, treat as raw text list
    }
    return items.split(',').map(s => s.trim());
  }
  return [];
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const deleteShopOrder = async (id) => {
  if (!confirm("Ви впевнені, що хочете видалити це замовлення магазину з книги обліку?")) return;
  try {
    const response = await api.delete(`/api/orders/shop/${id}`);
    if (response.status === 200) {
      alert("Замовлення магазину видалено!");
      await fetchOrders();
    }
  } catch (error) {
    console.error("Помилка видалення замовлення:", error);
    alert("Не вдалося видалити замовлення.");
  }
};

const deletePrintOrder = async (id) => {
  if (!confirm("Ви впевнені, що хочете видалити це замовлення друку з книги обліку?")) return;
  try {
    const response = await api.delete(`/api/orders/printing/${id}`);
    if (response.status === 200) {
      alert("Замовлення друку видалено!");
      await fetchOrders();
    }
  } catch (error) {
    console.error("Помилка видалення замовлення:", error);
    alert("Не вдалося видалити замовлення.");
  }
};

onMounted(fetchOrders);
</script>

<style scoped>
.orders-page {
  max-width: 1400px;
  margin: 0 auto;
  color: white;
}

.orders-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .orders-list {
    grid-template-columns: 1fr;
  }
}

.page-title {
  text-align: center;
  color: #e0aaff;
  margin-bottom: 30px;
  text-shadow: 0 0 15px rgba(224, 170, 255, 0.4);
}

/* Налаштування вкладок */
.tabs-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 35px;
}

.tab-btn {
  background: rgba(45, 20, 80, 0.4);
  border: 1px solid #7b2cbf;
  color: #b39ddb;
  padding: 12px 24px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  font-family: 'Cinzel', serif;
}

.tab-btn:hover {
  background: rgba(123, 44, 191, 0.2);
  border-color: #e0aaff;
  color: white;
}

.tab-btn.active {
  background: #c5a059;
  color: #1a0b2e;
  border-color: #c5a059;
  box-shadow: 0 0 15px rgba(197, 160, 89, 0.4);
}

/* Картки замовлень */
.order-card {
  background: rgba(45, 20, 80, 0.6);
  border: 1px solid #7b2cbf;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  transition: 0.3s;
}

.order-card:hover {
  border-color: #e0aaff;
  box-shadow: 0 0 15px rgba(123, 44, 191, 0.4);
}

.order-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #5a189a;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.order-number {
  font-weight: bold;
  color: #ff9e00;
  font-family: 'Cinzel', serif;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: bold;
}

.status-badge.processing { background: #ff9e00; color: #1a0b2e; }
.status-badge.pending { background: #5a189a; color: #e0aaff; }
.status-badge.completed { background: #2ec4b6; color: white; }

.order-body p {
  margin: 8px 0;
  line-height: 1.5;
}

.items-list-container {
  margin: 12px 0;
}

.items-list {
  list-style: none;
  padding-left: 10px;
  margin: 5px 0;
}

.items-list li {
  padding: 3px 0;
  color: #e0aaff;
}

.price-section {
  font-size: 1.1rem;
  margin: 15px 0 10px 0;
  border-top: 1px dashed rgba(123, 44, 191, 0.5);
  padding-top: 10px;
}

.total-price-value {
  color: #ff9e00;
  font-weight: bold;
}

.price-note {
  margin-top: 15px;
  padding: 10px;
  background: rgba(255, 158, 0, 0.1);
  border-left: 3px solid #ff9e00;
  font-size: 0.9rem;
  color: #ffb742;
}

.date-note {
  font-size: 0.85rem;
  color: #a78bfa;
  margin-top: 15px;
  opacity: 0.8;
}

.loader {
  text-align: center;
  font-style: italic;
  color: #b39ddb;
  font-size: 1.2rem;
  margin-top: 50px;
}

.no-orders {
  text-align: center;
  margin-top: 50px;
}

.go-shop {
  display: inline-block;
  margin-top: 20px;
  color: #e0aaff;
  text-decoration: underline;
  font-weight: bold;
}
</style>