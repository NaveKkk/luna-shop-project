import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // Імпортуємо наш файл з папки router
import './assets/main.css'    // Підключаємо стилі

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router) // Кажемо Vue використовувати роутер
app.mount('#app')