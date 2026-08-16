import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

store.subscribe(() => {
  const cart = store.getState().cart;
  localStorage.setItem('cart', JSON.stringify(cart));
});

export default store;
