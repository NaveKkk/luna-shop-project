import { defineStore } from 'pinia';
import axios from 'axios';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    discount: 0,
    appliedPromoCode: null, // Зберігаємо застосований промокод
  }),
  getters: {
    // Рахуємо суму без знижки
    subtotal: (state) => state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    // Сума знижки у гривнях
    discountAmount: (state) => (state.subtotal * state.discount) / 100,
    // Фінальна ціна
    totalPrice: (state) => state.subtotal - state.discountAmount
  },
  actions: {
    addToCart(product) {
      const existing = this.items.find(i => i.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
    },
    removeItem(id) {
      this.items = this.items.filter(i => i.id !== id);
    },
    clearCart() {
      this.items = [];
      this.discount = 0;
      this.appliedPromoCode = null;
    },
    async applyPromo(code) {
      try {
        const response = await axios.post('https://luna-shop-backend.onrender.com/api/promocodes/validate', { code });
        if (response.data.valid) {
          this.discount = response.data.discount;
          this.appliedPromoCode = code;
          return { success: true, discount: response.data.discount };
        }
      } catch (error) {
        console.error("Помилка валідації промокоду:", error);
        if (error.response && error.response.data && error.response.data.error) {
          return { success: false, message: error.response.data.error };
        }
      }
      return { success: false, message: "Цей сувій (код) недійсний..." };
    }
  }
});