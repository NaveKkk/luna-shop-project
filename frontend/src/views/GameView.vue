<template>
  <div class="game-page-container">
    <header class="game-header">
      <h1 class="magic-title">Випробуй магію таро</h1>
      <p class="game-instruction">
        Знайди особливу карту серед п'яти таємничих символів долі, щоб отримати знижку <b>-40%</b>!
      </p>
    </header>

    <div class="game-split-content">
      <!-- Ліва колонка: Ігрове поле -->
      <section class="game-board-section card-tarot-style">
        <h2>Магічний розклад</h2>
        
        <div class="cards-grid">
          <transition-group name="shuffle">
            <div 
              v-for="(card, index) in cards" 
              :key="card.id"
              class="card-wrapper"
            >
              <div 
                class="card" 
                :class="{ 'is-flipped': isFlipped }"
                @click="handleCardClick(index)"
              >
                <div class="card-face card-back">
                  <span class="emoji-icon">🔮</span>
                </div>
                
                <div class="card-face card-front">
                  <div v-if="card.isSpecial" class="discount-badge">-40%</div>
                  <span class="emoji-icon">{{ card.emoji }}</span>
                  <p class="card-name">{{ card.name }}</p>
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <div class="controls">
          <button v-if="gameState === 'idle'" @click="startGame" class="magic-btn">
            Почати гру (Тасувати карти) ✨
          </button>
          
          <div v-if="gameState === 'shuffling'" class="shuffling-text">
            🕯️ Карти заряджаються магічною енергією...
          </div>
          
          <div v-if="gameState === 'picking'" class="picking-text">
            🔮 Оберіть одну карту зі столу!
          </div>

          <div v-if="promoCode" class="promo-result">
            Ваш магічний промокод:
            <span class="promo-code-box">{{ promoCode }}</span>
            <small class="promo-hint">Скопіюйте його та вставте в кошику для активації знижки.</small>
          </div>
        </div>
      </section>

      <!-- Права колонка: Опис карт -->
      <section class="card-meanings-section card-tarot-style">
        <h2>Значення Старших Арканів</h2>
        <div class="meanings-list">
          <div class="meaning-item">
            <span class="meaning-emoji">🌙</span>
            <div class="meaning-desc">
              <h4>The Moon (Місяць) — Особлива карта</h4>
              <p>Символізує таємничість, загострену інтуїцію, сни та приховані знання. <b>Знаходження цієї карти дарує знижку 40%!</b></p>
            </div>
          </div>

          <div class="meaning-item">
            <span class="meaning-emoji">⭐</span>
            <div class="meaning-desc">
              <h4>The Star (Зірка)</h4>
              <p>Символ надії, натхнення, духовного спокою та світлого майбутнього. Вказує на те, що ви на вірному шляху.</p>
            </div>
          </div>

          <div class="meaning-item">
            <span class="meaning-emoji">☀️</span>
            <div class="meaning-desc">
              <h4>The Sun (Сонце)</h4>
              <p>Втілює повну ясність розуму, успіх, життєву енергію, радість та теплоту стосунків.</p>
            </div>
          </div>

          <div class="meaning-item">
            <span class="meaning-emoji">🃏</span>
            <div class="meaning-desc">
              <h4>The Fool (Дурень)</h4>
              <p>Символізує початок нової подорожі, довіру до Всесвіту, свободу від упереджень та легкість буття.</p>
            </div>
          </div>

          <div class="meaning-item">
            <span class="meaning-emoji">🌍</span>
            <div class="meaning-desc">
              <h4>The World (Світ)</h4>
              <p>Символ тріумфу, гармонії з собою та світом, досягнення цілей та успішного завершення важливого етапу.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api';

const gameState = ref('idle'); 
const isFlipped = ref(false);
const promoCode = ref('');

const cards = ref([
  { id: 1, name: 'The Moon', isSpecial: true, emoji: '🌙' },
  { id: 2, name: 'The Star', isSpecial: false, emoji: '⭐' },
  { id: 3, name: 'The Sun', isSpecial: false, emoji: '☀️' },
  { id: 4, name: 'The Fool', isSpecial: false, emoji: '🃏' },
  { id: 5, name: 'The World', isSpecial: false, emoji: '🌍' },
]);

const startGame = async () => {
  gameState.value = 'shuffling';
  promoCode.value = '';
  isFlipped.value = false; // Показуємо карти гравцю
  
  // Через 2 секунди перевертаємо сорочкою догори
  setTimeout(() => {
    isFlipped.value = true; 
    // Через 1 секунду після перевороту починаємо тасувати
    setTimeout(shuffleCards, 1000);
  }, 2000);
};

const shuffleCards = () => {
  let times = 0;
  const interval = setInterval(() => {
    // Створюємо копію масиву і перемішуємо її
    cards.value = [...cards.value].sort(() => Math.random() - 0.5);
    times++;
    
    if (times > 10) {
      clearInterval(interval);
      gameState.value = 'picking';
    }
  }, 600); // 600мс достатньо, щоб око встигало за рухом
};

const handleCardClick = async (index) => {
  if (gameState.value !== 'picking') return;

  isFlipped.value = false; // Відкриваємо карти

  if (cards.value[index].isSpecial) {
    gameState.value = 'won';
    try {
      const response = await api.post('/api/promocodes/generate', { 
        discount: 40 
      });
      promoCode.value = response.data.code;
    } catch (e) {
      promoCode.value = "LUNA-MAGIC-40"; 
    }
  } else {
    alert("Спробуйте ще раз! Магія не підкорилася.");
    gameState.value = 'idle';
  }
};
</script>

<style scoped>
.game-page-container {
  max-width: 1400px;
  margin: 0 auto;
  color: white;
}

.game-header {
  text-align: center;
  margin-bottom: 40px;
}

.magic-title {
  font-family: 'Cinzel', serif;
  color: #e0aaff;
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 0 0 15px rgba(224, 170, 255, 0.4);
}

.game-instruction {
  font-size: 1.1rem;
  color: #b39ddb;
}

/* Спліт-сітка */
.game-split-content {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 40px;
  align-items: stretch;
}

@media (max-width: 1100px) {
  .game-split-content {
    grid-template-columns: 1fr;
    gap: 35px;
  }
}

.game-board-section h2, .card-meanings-section h2 {
  font-family: 'Cinzel', serif;
  color: #c5a059;
  font-size: 1.6rem;
  margin-bottom: 25px;
}

/* Ігрове поле */
.game-board-section {
  background: rgba(30, 11, 54, 0.8); 
  padding: 30px;
  border-radius: 15px;
  border: 1px solid #7b2cbf;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cards-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  perspective: 1000px;
  margin: 30px auto;
  max-width: 450px;
}

/* Анімація переміщення від transition-group */
.shuffle-move {
  transition: transform 0.6s ease-in-out;
}

.card-wrapper {
  transition: all 0.5s ease;
}

.card {
  width: 125px;
  height: 210px;
  position: relative;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  cursor: pointer;
  user-select: none;
}

.card.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  border: 2px solid #c5a059;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}

.card-back {
  background: #1a0b2e;
  transform: rotateY(180deg);
}

.card-front {
  background: #2e1a47;
}

.emoji-icon {
  font-size: 3rem;
  margin-bottom: 8px;
}

.card-name {
  font-family: 'Cinzel', serif;
  color: #f0e6ff;
  font-size: 0.8rem;
  margin: 0;
}

.discount-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #c5a059;
  color: #1a0b2e;
  padding: 3px 6px;
  font-weight: bold;
  border-radius: 4px;
  font-size: 0.7rem;
}

/* Елементи керування */
.controls {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
}

.magic-btn {
  background: #c5a059;
  color: #1a0b2e;
  padding: 14px 35px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.3s;
  font-family: 'Cinzel', serif;
  box-shadow: 0 0 10px rgba(197, 160, 89, 0.3);
}

.magic-btn:hover {
  background: #e2bc7a;
  transform: scale(1.03);
  box-shadow: 0 0 20px rgba(197, 160, 89, 0.5);
}

.shuffling-text, .picking-text {
  font-size: 1.1rem;
  color: #e0aaff;
  font-style: italic;
  text-align: center;
}

.promo-result {
  margin-top: 20px;
  font-size: 1.3rem;
  color: #c5a059;
  text-align: center;
}

.promo-code-box {
  display: block;
  margin: 12px auto;
  background: #2e1a47;
  padding: 10px 25px;
  border: 2px dashed #c5a059;
  font-family: monospace;
  font-weight: bold;
  font-size: 1.6rem;
  width: max-content;
}

.promo-hint {
  display: block;
  font-size: 0.8rem;
  color: #b39ddb;
  margin-top: 5px;
}

/* Опис карт */
.card-meanings-section {
  background: rgba(30, 11, 54, 0.8);
  padding: 30px;
  border-radius: 15px;
  border: 1px solid #7b2cbf;
}

.meanings-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.meaning-item {
  display: flex;
  gap: 15px;
  align-items: flex-start;
  text-align: left;
  border-bottom: 1px dashed rgba(123, 44, 191, 0.3);
  padding-bottom: 15px;
}

.meaning-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.meaning-emoji {
  font-size: 2.2rem;
  background: #1a0b2e;
  padding: 8px;
  border-radius: 50%;
  border: 1px solid rgba(197, 160, 89, 0.4);
  flex-shrink: 0;
}

.meaning-desc h4 {
  margin: 0 0 6px 0;
  font-size: 1.1rem;
  color: #c5a059;
  font-family: 'Cinzel', serif;
}

.meaning-desc p {
  margin: 0;
  color: #b39ddb;
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .cards-grid {
    max-width: 300px !important;
    gap: 8px !important;
  }
  
  .card {
    width: 85px !important;
    height: 145px !important;
  }
  
  .emoji-icon {
    font-size: 2.2rem !important;
  }
  
  .card-name {
    font-size: 0.7rem !important;
  }
  
  .discount-badge {
    font-size: 0.6rem !important;
    padding: 2px 4px !important;
  }
}
</style>