import { createSlice } from '@reduxjs/toolkit';

const getInitialCart = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getInitialCart(),
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const existingItem = state.find((cartItem) => cartItem._id === item._id);

      if (existingItem) {
        const nextQty = (existingItem.qty || 1) + (item.qty || 1);
        const maxQty = Number(existingItem.countInStock || nextQty);
        existingItem.qty = Math.min(nextQty, maxQty);
        return;
      }

      state.push({ ...item, qty: Number(item.qty || 1) });
    },
    removeItem: (state, action) =>
      state.filter((cartItem) => cartItem._id !== action.payload),
    updateCartQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.find((cartItem) => cartItem._id === id);
      if (!item) return;
      item.qty = Math.max(1, Number(qty) || 1);
    },
    clearCart: () => [],
  },
});

export const { addItem, removeItem, updateCartQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
