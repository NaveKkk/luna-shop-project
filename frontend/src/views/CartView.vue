<template>
  <div class="cart-container">
    <h1 class="cart-title">Ваш магічний кошик</h1>

    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <p>Ваш кошик порожній... Можливо, час додати трохи магії?</p>
      <router-link to="/shop" class="back-btn">До магазину</router-link>
    </div>

    <div v-else class="cart-content">
      <!-- Ліва колонка: Товари в кошику -->
      <div class="cart-items">
        <h2>Список обраних книг</h2>
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item card-tarot-style">
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p class="item-price">{{ item.price }} грн x {{ item.quantity }}</p>
          </div>
          <button @click="cartStore.removeItem(item.id)" class="remove-btn">
            <i class="fas fa-trash"></i> Прибрати
          </button>
        </div>
      </div>

      <!-- Права колонка: Підсумок замовлення -->
      <div class="cart-summary card-tarot-style">
        <h2>Оформлення замовлення</h2>

        <!-- Промокод -->
        <div class="promo-section">
          <input 
            v-model="promoInput" 
            placeholder="Введіть код з Таро" 
            maxlength="30"
            class="promo-input"
          />
          <button @click="checkPromo" class="promo-btn">Застосувати</button>
        </div>

        <!-- Пошта покупця -->
        <div class="email-section">
          <label for="order-email">Ваш Email для магічного зв'язку</label>
          <input 
            id="order-email"
            v-model="userEmail" 
            type="email" 
            placeholder="example@mail.com" 
            maxlength="30"
            class="promo-input email-input" 
          />
        </div>

        <!-- Розрахунок вартості -->
        <div class="total-details">
          <div class="cost-row">
            <span>Сума товарів:</span>
            <span>{{ cartStore.subtotal }} грн</span>
          </div>
          <div v-if="cartStore.discount > 0" class="cost-row discount-text">
            <span>Знижка мага (-{{ cartStore.discount }}%):</span>
            <span>-{{ cartStore.discountAmount }} грн</span>
          </div>
          <div class="cost-row final-row">
            <span>Разом:</span>
            <span class="final-price">{{ cartStore.totalPrice }} грн</span>
          </div>
          <button @click="placeOrder" class="checkout-btn">
            Оформити замовлення ✨
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '../store/cart';
import api from '../api'; 

const cartStore = useCartStore();
const promoInput = ref('');
const userEmail = ref(''); // Додаємо поле для пошти

const checkPromo = async () => {
  if (!promoInput.value) return;
  const result = await cartStore.applyPromo(promoInput.value);
  if (result.success) {
    alert(`Магія спрацювала! Знижку -${result.discount}% застосовано.`);
  } else {
    alert(result.message || "Цей сувій (код) недійсний...");
  }
};

const placeOrder = async () => {
  if (!userEmail.value) {
    alert("Будь ласка, вкажіть вашу магічну пошту (email) для зв'язку!");
    return;
  }

  if (cartStore.items.length === 0) {
    alert("Ваш кошик порожній!");
    return;
  }

  try {
    const orderData = {
      email: userEmail.value,
      // Відправляємо масив товарів, як того чекає сервер
      items: cartStore.items,
      total: cartStore.totalPrice,
      promocode: cartStore.appliedPromoCode // Передаємо активований промокод
    };

    // Відправляємо на Express-сервер
    const response = await api.post('/api/orders/shop', orderData);

    if (response.status === 200 || response.status === 201) {
      alert("Замовлення прийняте! Сови вже полетіли до вас.");
      
      const orderId = response.data.id;
      if (orderId) {
        const shopOrders = JSON.parse(localStorage.getItem('my_shop_orders') || '[]');
        shopOrders.push(orderId);
        localStorage.setItem('my_shop_orders', JSON.stringify(shopOrders));
      }
      
      cartStore.clearCart(); // Очищуємо кошик після успіху
      userEmail.value = '';
    }
  } catch (error) {
    console.error("Помилка при оформленні:", error);
    alert("Здається, магічний канал зв'язку перервано. Спробуйте пізніше.");
  }
};
</script>

<style scoped>
.cart-container {
  max-width: 1400px;
  margin: 0 auto;
  color: white;
}

.cart-title {
  text-align: center;
  color: #e0aaff;
  font-size: 2.5rem;
  margin-bottom: 40px;
  text-shadow: 0 0 15px rgba(224, 170, 255, 0.4);
}

/* Спліт-сітка */
.cart-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  align-items: start;
}

@media (max-width: 900px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

.cart-items h2, .cart-summary h2 {
  font-family: 'Cinzel', serif;
  color: #c5a059;
  font-size: 1.5rem;
  margin-bottom: 25px;
}

/* Товари кошика */
.cart-items {
  display: flex;
  flex-direction: column;
}

.cart-item {
  background: rgba(46, 26, 71, 0.6);
  border: 1px solid #7b2cbf;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  text-align: left;
  transition: transform 0.3s, box-shadow 0.3s;
}

.cart-item:hover {
  transform: translateX(5px);
  box-shadow: 0 0 15px rgba(123, 44, 191, 0.3);
}

.item-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.15rem;
  color: white;
}

.item-price {
  margin: 0;
  color: #e0aaff;
  font-size: 0.95rem;
}

.remove-btn {
  background: transparent;
  color: #ff4d4d;
  border: 1px solid #ff4d4d;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  font-weight: bold;
}

.remove-btn:hover {
  background: #ff4d4d;
  color: white;
  box-shadow: 0 0 8px rgba(255, 77, 77, 0.4);
}

/* Секція оформлення */
.cart-summary {
  background: rgba(30, 20, 50, 0.9);
  padding: 30px;
  border-radius: 15px;
  border: 1px solid #7b2cbf;
}

.promo-section {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.promo-input {
  flex: 1;
  background: #1a0b2e;
  border: 1px solid #4c1d95;
  padding: 12px;
  border-radius: 8px;
  color: white;
  outline: none;
  font-family: inherit;
  transition: all 0.3s;
}

.promo-input:focus {
  border-color: #c5a059;
  box-shadow: 0 0 8px rgba(197, 160, 89, 0.4);
}

.promo-btn {
  background: #c5a059;
  color: #1a0b2e;
  border: none;
  padding: 0 22px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  transition: background 0.2s;
}

.promo-btn:hover {
  background: #e2bc7a;
}

.email-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 25px;
  text-align: left;
}

.email-section label {
  color: #e9d5ff;
  font-size: 0.95rem;
}

.email-input {
  width: 100%;
  box-sizing: border-box;
}

/* Деталізація цін */
.total-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px dashed rgba(123, 44, 191, 0.5);
  padding-top: 20px;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.05rem;
  color: #b39ddb;
}

.discount-text {
  color: #c5a059 !important;
  font-style: italic;
}

.final-row {
  border-top: 1px dashed rgba(123, 44, 191, 0.3);
  padding-top: 12px;
  font-weight: bold;
}

.final-row span:first-child {
  color: white;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
}

.final-price {
  color: #ff9e00;
  font-size: 2.1rem;
}

.checkout-btn {
  width: 100%;
  background: linear-gradient(45deg, #7b2cbf, #9d4edd);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 30px;
  font-size: 1.15rem;
  font-weight: bold;
  margin-top: 15px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(123, 44, 191, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(123, 44, 191, 0.6);
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
}

.empty-cart p {
  font-size: 1.25rem;
  color: #b39ddb;
}

.back-btn {
  display: inline-block;
  margin-top: 20px;
  background: rgba(197, 160, 89, 0.1);
  border: 1px solid #c5a059;
  color: #c5a059;
  padding: 10px 25px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #c5a059;
  color: #1a0b2e;
  box-shadow: 0 0 10px rgba(197, 160, 89, 0.3);
}

@media (max-width: 600px) {
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .remove-btn {
    width: 100%;
    text-align: center;
  }
  
  .cart-summary {
    padding: 20px 15px !important;
  }

  .promo-section {
    flex-direction: column;
    gap: 10px;
  }
  
  .promo-btn {
    padding: 12px;
    width: 100%;
  }
}
</style>