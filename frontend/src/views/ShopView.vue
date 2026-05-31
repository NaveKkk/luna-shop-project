<template>
  <div class="shop-container">
    <header class="shop-header">
      <h1>Magical Luna Shop</h1>
      <p class="shop-description">
        Ласкаво просимо до нашої магічної книгарні. Тут ви знайдете цікаві вам книжки, приємні ціни та можливість придбати товар зі знижкою. 
        Кожна річ обрана з любов'ю до деталей та вподобанням наших клієнтів.
      </p>
    </header>

    <div class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image-container">
          <img 
            :src="getImageUrl(product.image)" 
            :alt="product.name" 
            class="product-img"
          >
        </div>
        
        <div class="card-content">
          <h3 class="product-title">{{ product.name }}</h3>
          <p class="product-price">{{ product.price }} грн</p>
          <button class="add-to-cart-btn" @click="addToCart(product)">
            <i class="fas fa-shopping-cart"></i> До кошика
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '../store/cart'; 

const cartStore = useCartStore();

// Масив товарів із назвами файлів, які лежать у src/assets/
const products = ref([
  { id: 1, name: 'Божественні супротивники. Книга 1', price: 714, image: 'book1.webp' },
  { id: 2, name: 'Мова драконів. Книга 1', price: 580, image: 'book2.webp' },
  { id: 3, name: 'Коли впаде король. Книга 1', price: 526, image: 'book3.webp' },
  { id: 4, name: 'Ключ від Потойбіччя. Книга 3', price: 500, image: 'book4.webp' },
  { id: 5, name: 'Прокляття переможця. Книга 1', price: 496, image: 'book5.webp' },
  { id: 6, name: 'Природнича історія драконів', price: 480, image: 'book6.webp' },
  { id: 7, name: 'Вавилон. Прихована історія', price: 765, image: 'book7.webp' },
  { id: 8, name: 'Механічний янгол. Книга 1', price: 714, image: 'book8.webp' },
]);

// Функція для динамічного імпорту зображень у Vite
const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

const addToCart = (product) => {
  cartStore.addToCart(product);
  alert(`${product.name} додано до магічного кошика!`);
};
</script>

<style scoped>
.shop-container {
  max-width: 1400px;
  margin: 0 auto;
}

.shop-header {
  text-align: center;
  margin-bottom: 50px;
}

.shop-header h1 {
  font-size: 3rem;
  color: #e0aaff;
  text-shadow: 0 0 15px rgba(224, 170, 255, 0.5);
  margin-bottom: 15px;
}

.shop-description {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #b39ddb;
  max-width: 800px;
  margin: 0 auto;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

.product-card {
  background: rgba(30, 20, 50, 0.8);
  border: 1px solid #7b2cbf;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  max-width: 360px;
  margin: 0 auto;
  width: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(157, 78, 221, 0.3);
  border-color: #e0aaff;
}

.product-image-container {
  width: 100%;
  height: 280px; /* Оптимальна висота для обкладинок книг */
  background: #240046;
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.card-content {
  padding: 15px;
  text-align: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-title {
  font-size: 1rem;
  margin-bottom: 10px;
  color: #ffffff;
  min-height: 3em; /* Щоб заголовки були однієї висоти */
}

.product-price {
  font-weight: bold;
  font-size: 1.2rem;
  color: #ff9e00;
  margin-bottom: 15px;
}

.add-to-cart-btn {
  background: #9d4edd;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  font-weight: bold;
}

.add-to-cart-btn:hover {
  background: #c77dff;
  box-shadow: 0 0 10px rgba(199, 125, 255, 0.5);
}

/* Адаптивність */
@media (max-width: 1100px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 800px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 500px) {
  .product-grid { 
    grid-template-columns: repeat(3, 1fr); 
    gap: 8px;
  }
  
  .product-card {
    border-radius: 8px;
  }
  
  .product-image-container {
    height: 140px;
  }
  
  .card-content {
    padding: 8px;
  }
  
  .product-title {
    font-size: 0.75rem !important;
    line-height: 1.2;
    min-height: 2.4em;
    margin-bottom: 5px;
  }
  
  .product-price {
    font-size: 0.85rem !important;
    margin-bottom: 8px;
  }
  
  .add-to-cart-btn {
    padding: 6px 10px;
    font-size: 0.7rem !important;
    border-radius: 15px;
  }
}
</style>