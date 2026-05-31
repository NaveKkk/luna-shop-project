<template>
  <div class="app-layout">
    <header class="magic-header">
      <div class="header-top">
        <div class="header-content-wrapper">
          <div class="logo-container">
            <img src="./assets/logo.png" alt="Luna Shop Logo" class="main-logo">
            <span class="logo-text">LUNA SHOP</span>
          </div>

          <button 
            class="hamburger-btn" 
            :class="{ 'is-active': isMenuOpen }" 
            @click="isMenuOpen = !isMenuOpen"
            title="Меню"
          >
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>

          <nav class="navigation" :class="{ 'menu-open': isMenuOpen }">
            <router-link to="/">Головна</router-link>
            <router-link to="/shop">Магазин</router-link>
            <router-link to="/print">Поліграфія</router-link>
            <router-link to="/game">Гра Таро</router-link>
            <router-link to="/cart">Кошик</router-link>
            <router-link to="/orders">Замовлення</router-link>
            <router-link to="/reviews">Відгуки</router-link>
          </nav>
        </div>
      </div>

      <div class="magic-banner">
        <div class="sparkles">
          <div class="sparkle s1">✦</div>
          <div class="sparkle s2">✧</div>
          <div class="sparkle s3">✦</div>
          <div class="sparkle s4">✧</div>
          <div class="sparkle s5">✦</div>
          <div class="sparkle s6">✧</div>
        </div>
        <div class="banner-content">
          <h2>Відкрий свою долю серед книжкових полиць</h2>
          <p>Магічні видання та захопливий досвід для справжніх шукачів істини</p>
        </div>
      </div>
    </header>

    <main class="content-wrapper">
      <router-view />
    </main>

    <footer class="magic-footer">
      <div class="footer-content">
        <div class="footer-logo">LUNA SHOP</div>
        <div class="footer-links">
          <router-link to="/">Головна</router-link>
          <router-link to="/shop">Магазин</router-link>
          <router-link to="/print">Поліграфія</router-link>
          <router-link to="/game">Гра Таро</router-link>
          <router-link to="/cart">Кошик</router-link>
          <router-link to="/orders">Замовлення</router-link>
          <router-link to="/reviews">Відгуки</router-link>
        </div>
        <p class="footer-text">© 2026 LUNA SHOP. Усі права захищені совами-охоронцями. 🔮✨</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const isMenuOpen = ref(false);
const route = useRoute();

// Закриваємо мобільне меню при переході на іншу сторінку
watch(() => route.path, () => {
  isMenuOpen.value = false;
});
</script>

<style>
/* Загальні налаштування */
body {
  margin: 0;
  background-color: #200934; /* Основний колір сайту */
  color: #f0e6ff;
}

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-wrapper {
  flex: 1 0 auto;
}

.magic-header {
  background: transparent;
}

.header-top {
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 12px 20px;
  background: #150a24; /* Трохи світліший за фон */
  border-bottom: 2px solid #c5a059;
  box-shadow: 0 0 20px rgba(75, 44, 113, 0.5);
}

/* Логотип */
.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
.main-logo {
  height: 42px;
  width: auto;
  filter: drop-shadow(0 0 5px #c5a059);
  transition: transform 0.3s ease;
}
.main-logo:hover {
  transform: scale(1.1) rotate(5deg);
}
.logo-text {
  font-family: 'Cinzel', serif;
  color: #c5a059;
  font-weight: bold;
  font-size: 1.2rem;
  letter-spacing: 2px;
}

/* Навігація */
.navigation a {
  color: #b39ddb;
  text-decoration: none;
  margin: 0 10px;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: 4px;
}

.navigation a:hover, .navigation a.router-link-active {
  color: #c5a059;
  text-shadow: 0 0 10px rgba(197, 160, 89, 0.6);
  border: 1px solid #c5a059;
  background: rgba(75, 44, 113, 0.3);
  transform: translateY(-2px);
}

/* Банер */
.magic-banner {
  height: 250px;
  background: linear-gradient(rgba(26, 11, 46, 0.55), rgba(26, 11, 46, 0.55)), 
              url('./assets/baner.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-top: 1px solid #4b2c71;
  border-bottom: 2px solid #c5a059; /* Золота роздільна смуга */
  box-shadow: 0 4px 20px rgba(197, 160, 89, 0.35); /* Золоте сяяння */
  position: relative;
  overflow: hidden;
}

.banner-content {
  position: relative;
  z-index: 2;
}

.banner-content h2 {
  font-family: 'Cinzel', serif;
  color: #c5a059;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

/* Блискітки */
.sparkles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.sparkle {
  position: absolute;
  color: #c5a059;
  font-size: 1.5rem;
  opacity: 0;
  animation: sparkle-shimmer 4s infinite ease-in-out;
}

@keyframes sparkle-shimmer {
  0%, 100% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(180deg);
    opacity: 0.8;
    text-shadow: 0 0 10px #c5a059, 0 0 20px #e0aaff;
  }
}

.sparkle.s1 { top: 20%; left: 15%; animation-delay: 0s; font-size: 1.2rem; }
.sparkle.s2 { top: 75%; left: 25%; animation-delay: 1.5s; font-size: 1.6rem; color: #e0aaff; }
.sparkle.s3 { top: 30%; left: 50%; animation-delay: 0.8s; font-size: 1rem; }
.sparkle.s4 { top: 60%; left: 70%; animation-delay: 2.2s; font-size: 1.4rem; color: #e0aaff; }
.sparkle.s5 { top: 25%; left: 85%; animation-delay: 1.1s; font-size: 1.5rem; }
.sparkle.s6 { top: 80%; left: 90%; animation-delay: 3s; font-size: 1.1rem; color: #c5a059; }

/* Адаптивність */
@media (max-width: 1024px) {
  .header-content-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .banner-content h2 {
    font-size: 1.8rem;
  }
}
</style>