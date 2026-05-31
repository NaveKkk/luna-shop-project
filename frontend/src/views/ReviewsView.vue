<template>
  <div class="reviews-page">
    <header class="reviews-header">
      <h1 class="page-title">Магічні Відгуки</h1>
      <p class="subtitle">Поділіться своїм досвідом або дізнайтеся, що кажуть інші шукачі істини</p>
    </header>

    <div class="reviews-content">
      <!-- Форма залишення відгуку -->
      <section class="review-form-section card-tarot-style">
        <h2>Залишити відгук</h2>
        <form @submit.prevent="submitReview" class="review-form">
          <div class="form-group">
            <label for="username">Ваше ім'я або псевдонім</label>
            <input 
              type="text" 
              id="username" 
              v-model="newReview.user_name" 
              placeholder="Наприклад: Мерлін" 
              maxlength="30"
              required
            />
          </div>

          <div class="form-group">
            <label>Ваша оцінка</label>
            <div class="stars-picker">
              <button 
                v-for="star in 5" 
                :key="star" 
                type="button" 
                class="star-btn"
                @click="newReview.rating = star"
              >
                <span :class="['star-icon', { filled: star <= newReview.rating }]">★</span>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="comment">Ваше враження</label>
            <textarea 
              id="comment" 
              v-model="newReview.comment" 
              placeholder="Поділіться своїми думками про наші книги або поліграфію..." 
              maxlength="500"
              rows="4" 
              required
            ></textarea>
          </div>

          <button type="submit" class="submit-btn" :disabled="submitting">
            {{ submitting ? 'Записуємо відгук...' : 'Опублікувати відгук ✨' }}
          </button>
        </form>
      </section>

      <!-- Список відгуків -->
      <section class="reviews-list-section">
        <h2>Сувої відгуків</h2>
        
        <div v-if="loading" class="loader">Зчитуємо магічні сувої...</div>
        
        <div v-else-if="reviews.length === 0" class="no-reviews">
          <p>Ще немає жодного відгуку. Будьте першим, хто залишить свій слід!</p>
        </div>

        <div v-else class="reviews-list">
          <transition-group name="fade">
            <div v-for="review in reviews" :key="review.id" class="review-card card-tarot-style">
              <div class="review-card-header">
                <div class="user-avatar">
                  {{ getInitials(review.user_name) }}
                </div>
                <div class="user-meta">
                  <h3 class="user-name">{{ review.user_name }}</h3>
                  <span class="review-date">{{ formatDate(review.created_at) }}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div class="review-rating">
                    <span v-for="star in 5" :key="star" class="star-display">
                      {{ star <= review.rating ? '★' : '☆' }}
                    </span>
                  </div>
                  <button @click="deleteReview(review.id)" class="delete-btn-cross" title="Видалити відгук">×</button>
                </div>
              </div>
              <div class="review-card-body">
                <p class="comment-text">« {{ review.comment }} »</p>
              </div>
            </div>
          </transition-group>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

const reviews = ref([]);
const loading = ref(true);
const submitting = ref(false);

const newReview = reactive({
  user_name: '',
  rating: 5,
  comment: ''
});

const fetchReviews = async () => {
  try {
    const response = await axios.get('https://luna-shop-backend.onrender.com/api/reviews');
    reviews.value = response.data;
  } catch (error) {
    console.error('Помилка при завантаженні відгуків:', error);
  } finally {
    loading.value = false;
  }
};

const submitReview = async () => {
  submitting.value = true;
  try {
    const response = await axios.post('https://luna-shop-backend.onrender.com/api/reviews', {
      user_name: newReview.user_name,
      rating: newReview.rating,
      comment: newReview.comment
    });
    
    if (response.status === 200 || response.status === 201) {
      alert('Дякуємо! Ваш відгук успішно опубліковано.');
      
      // Очищуємо форму
      newReview.user_name = '';
      newReview.rating = 5;
      newReview.comment = '';
      
      // Оновлюємо список відгуків
      await fetchReviews();
    }
  } catch (error) {
    console.error('Помилка при надсиланні відгуку:', error);
    alert('Помилка надсилання відгуку. Будь ласка, перевірте з\'єднання з сервером.');
  } finally {
    submitting.value = false;
  }
};

const getInitials = (name) => {
  if (!name) return '🔮';
  const parts = name.trim().split(' ');
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const deleteReview = async (id) => {
  if (!confirm("Ви впевнені, що хочете видалити цей відгук з книги відгуків?")) return;
  try {
    const response = await axios.delete(`https://luna-shop-backend.onrender.com/api/reviews/${id}`);
    if (response.status === 200) {
      alert("Відгук видалено!");
      await fetchReviews();
    }
  } catch (error) {
    console.error("Помилка видалення відгуку:", error);
    alert("Не вдалося видалити відгук.");
  }
};

onMounted(fetchReviews);
</script>

<style scoped>
.reviews-page {
  max-width: 1400px;
  margin: 0 auto;
  color: white;
}

.reviews-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  color: #e0aaff;
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 0 0 15px rgba(224, 170, 255, 0.4);
}

.subtitle {
  color: #b39ddb;
  font-size: 1.1rem;
}

.reviews-content {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
  align-items: start;
}

@media (max-width: 900px) {
  .reviews-content {
    grid-template-columns: 1fr;
  }
}

/* Секція форми */
.review-form-section {
  background: rgba(30, 11, 54, 0.9);
  padding: 30px;
  border-radius: 12px;
}

.review-form-section h2, .reviews-list-section h2 {
  font-family: 'Cinzel', serif;
  color: #c5a059;
  font-size: 1.5rem;
  margin-bottom: 25px;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  color: #e9d5ff;
  font-weight: 500;
  font-size: 0.95rem;
}

input, textarea {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #4c1d95;
  background: #1a0b2e;
  color: white;
  outline: none;
  font-family: inherit;
  transition: all 0.3s;
}

input:focus, textarea:focus {
  border-color: #c5a059;
  box-shadow: 0 0 8px rgba(197, 160, 89, 0.4);
}

/* Вибір оцінки зірочками */
.stars-picker {
  display: flex;
  gap: 8px;
}

.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  outline: none;
}

.star-icon {
  font-size: 2.2rem;
  color: #4b2c71;
  transition: color 0.2s, transform 0.1s;
}

.star-icon.filled {
  color: #ff9e00;
  text-shadow: 0 0 10px rgba(255, 158, 0, 0.5);
}

.star-btn:hover .star-icon {
  transform: scale(1.15);
}

.submit-btn {
  padding: 14px;
  background: linear-gradient(45deg, #7b2cbf, #9d4edd);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 10px rgba(123, 44, 191, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(123, 44, 191, 0.5);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Секція списку відгуків */
.reviews-list-section {
  display: flex;
  flex-direction: column;
}

.loader {
  text-align: center;
  font-style: italic;
  color: #b39ddb;
  margin-top: 20px;
}

.no-reviews {
  text-align: center;
  padding: 40px;
  background: rgba(30, 11, 54, 0.5);
  border: 1px dashed #4b2c71;
  border-radius: 12px;
  color: #b39ddb;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  background: rgba(30, 20, 50, 0.7);
  padding: 20px;
  border-radius: 10px;
}

.review-card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
}

.user-avatar {
  width: 45px;
  height: 45px;
  background: #4b2c71;
  border: 1px solid #c5a059;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #c5a059;
  font-size: 0.95rem;
}

.user-meta {
  flex-grow: 1;
}

.user-name {
  margin: 0;
  font-size: 1.1rem;
  color: white;
}

.review-date {
  font-size: 0.75rem;
  color: #a78bfa;
  opacity: 0.75;
}

.review-rating {
  display: flex;
  color: #ff9e00;
  font-size: 1.2rem;
}

.star-display {
  text-shadow: 0 0 5px rgba(255, 158, 0, 0.4);
}

.review-card-body {
  border-left: 2px solid #c5a059;
  padding-left: 15px;
  margin-left: 5px;
}

.comment-text {
  margin: 0;
  line-height: 1.6;
  font-style: italic;
  color: #e0aaff;
}

/* Анімація появи */
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>