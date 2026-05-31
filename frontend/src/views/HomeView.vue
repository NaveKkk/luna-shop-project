<template>
  <div class="home-container">
    <!-- Верхній спліт-блок -->
    <div class="hero-split">
      <div class="hero-left">
        <h1 class="main-title">LUNA SHOP</h1>
        <h2 class="sub-title">Портал у світ книжкової магії ✨</h2>
        
        <p class="welcome-text">
          Вітаємо у місці, де кожна сторінка дихає чарами. Наша книгарня — це не просто магазин, 
          це справжній портал у світи фентезі, езотерики, загадкових таємниць та нових знань.
        </p>
        <p class="welcome-text">
          Ми ретельно підбираємо кожне видання, створюємо унікальну поліграфію за вашими ескізами 
          та замовляємо для вас книжки за допомогою швидкої совиної пошти. Дозвольте магії увійти у ваше життя!
        </p>

        <router-link to="/shop" class="cta-btn">
          Відвідати каталог книг 🔮
        </router-link>
      </div>

      <div class="hero-right">
        <!-- Картка 1: Ексклюзив -->
        <div class="feature-card card-tarot-style">
          <div class="feature-icon">✨</div>
          <h3>Ексклюзивні видання</h3>
          <p>Рідкісні фоліанти, колекційні обкладинки та видання з кольоровими зрізами для справжніх поціновувачів.</p>
        </div>

        <!-- Картка 2: Таро -->
        <div class="feature-card card-tarot-style">
          <div class="feature-icon">🔮</div>
          <h3>Таємнича знижка</h3>
          <p>Випробуйте свою долю у грі Таро, знайдіть щасливу карту й отримайте миттєву знижку -40% на замовлення.</p>
          <router-link to="/game" class="feature-link">Грати в Таро →</router-link>
        </div>

        <!-- Картка 3: Поліграфія -->
        <div class="feature-card card-tarot-style">
          <div class="feature-icon">📜</div>
          <h3>Власна поліграфія</h3>
          <p>Якісний магічний друк плакатів, листівок, постерів та наліпок за вашими власними ескізами.</p>
          <router-link to="/print" class="feature-link">Замовити друк →</router-link>
        </div>
      </div>
    </div>

    <!-- Секція бестселерів на всю ширину -->
    <div class="bestsellers-section">
      <h2 class="section-title">✨ Магічні Бестселери</h2>
      <p class="section-desc">Книги, які найчастіше обирають наші відвідувачі для своїх вечірніх ритуалів читання</p>
      
      <div class="product-grid">
        <div v-for="product in featuredProducts" :key="product.id" class="product-card card-tarot-style">
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '../store/cart';

const cartStore = useCartStore();

const featuredProducts = ref([
  { id: 1, name: 'Божественні супротивники. Книга 1', price: 714, image: 'book1.webp' },
  { id: 2, name: 'Мова драконів. Книга 1', price: 580, image: 'book2.webp' },
  { id: 3, name: 'Коли впаде король. Книга 1', price: 526, image: 'book3.webp' },
]);

const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

const addToCart = (product) => {
  cartStore.addToCart(product);
  alert(`${product.name} додано до магічного кошика!`);
};
</script>

<style scoped>
.home-container {
  max-width: 1400px;
  margin: 0 auto;
  color: white;
}

/* Спліт-блок */
.hero-split {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 50px;
  align-items: center;
  margin-bottom: 70px;
}

@media (max-width: 992px) {
  .hero-split {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

/* Ліва колонка */
.hero-left {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-title {
  font-family: 'Cinzel', serif;
  font-size: 3.8rem;
  color: #c5a059;
  text-shadow: 0 0 20px rgba(197, 160, 89, 0.4);
  margin: 0 0 10px 0;
  letter-spacing: 3px;
  text-align: center;
}

.sub-title {
  font-family: 'Cinzel', serif;
  font-size: 1.6rem;
  color: #e0aaff;
  margin-bottom: 25px;
  text-align: center;
}

.welcome-text {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #b39ddb;
  margin-bottom: 20px;
}

.cta-btn {
  display: inline-block;
  background: linear-gradient(45deg, #c5a059, #e2bc7a);
  color: #1a0b2e;
  padding: 15px 35px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.1rem;
  text-decoration: none;
  margin-top: 15px;
  box-shadow: 0 5px 15px rgba(197, 160, 89, 0.3);
  transition: all 0.3s ease;
  font-family: 'Cinzel', serif;
}

.cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(197, 160, 89, 0.5);
  color: black;
}

/* Права колонка з картками */
.hero-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-card {
  background: rgba(30, 11, 54, 0.7);
  border: 1px solid #7b2cbf;
  padding: 25px;
  border-radius: 12px;
  text-align: left;
}

.feature-card h3 {
  font-family: 'Cinzel', serif;
  color: #c5a059;
  margin: 10px 0;
  font-size: 1.25rem;
}

.feature-card p {
  color: #b39ddb;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 12px;
}

.feature-icon {
  font-size: 2rem;
}

.feature-link {
  color: #e0aaff;
  font-weight: bold;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.feature-link:hover {
  color: #c5a059;
}

/* Секція бестселерів */
.bestsellers-section {
  border-top: 1px solid rgba(123, 44, 191, 0.3);
  padding-top: 60px;
  text-align: center;
}

.section-title {
  font-family: 'Cinzel', serif;
  color: #c5a059;
  font-size: 2.2rem;
  margin-bottom: 10px;
}

.section-desc {
  color: #b39ddb;
  font-size: 1.1rem;
  margin-bottom: 40px;
}

/* Копіювання стилів сітки з ShopView */
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

/* Адаптивність перенесена донизу файлу */

.product-card {
  background: rgba(30, 20, 50, 0.8);
  border: 1px solid #7b2cbf;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-width: 360px;
  margin: 0 auto;
  width: 100%;
}

.product-image-container {
  width: 100%;
  height: 320px;
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
  padding: 20px;
  text-align: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-title {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #ffffff;
  min-height: 2.5em;
}

.product-price {
  font-weight: bold;
  font-size: 1.3rem;
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
  box-shadow: 0 0 12px rgba(199, 125, 255, 0.5);
}

@media (max-width: 900px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  
  .product-card {
    border-radius: 8px;
  }
  
  .product-image-container {
    height: 100px; /* Зменшуємо висоту зображення, щоб карти не були високими прямокутниками */
  }
  
  .card-content {
    padding: 6px;
  }
  
  .product-title {
    font-size: 0.7rem !important;
    line-height: 1.15;
    min-height: 2.3em;
    margin-bottom: 3px;
  }
  
  .product-price {
    font-size: 0.8rem !important;
    margin-bottom: 6px;
  }
  
  .add-to-cart-btn {
    padding: 4px 8px;
    font-size: 0.65rem !important;
    border-radius: 12px;
  }
}
</style>