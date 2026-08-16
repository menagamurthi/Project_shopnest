import { createContext, useContext } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from '../store/store';
import { addItem, clearCart, removeItem, updateCartQty } from '../store/cartSlice';

const CartContext = createContext();

export const CartProvider = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart || []);

  const addToCart = (item) => dispatch(addItem(item));
  const removeFromCart = (id) => dispatch(removeItem(id));
  const updateQty = (id, qty) => dispatch(updateCartQty({ id, qty }));
  const resetCart = () => dispatch(clearCart());

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart: resetCart,
    cartCount: cartItems.reduce((total, item) => total + Number(item.qty || 0), 0),
    cartTotal: cartItems.reduce((total, item) => total + Number(item.qty || 0) * Number(item.price || 0), 0),
  };
};

export const useCartContext = () => useContext(CartContext);