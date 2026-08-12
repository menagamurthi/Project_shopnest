import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext); // moved up

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => { // default qty = 1
    const existItem = cart.find((x) => x._id === product._id);

    if (existItem) {
      const newQty = existItem.qty + qty;
      if (newQty <= 0) {
        setCart(cart.filter((x) => x._id!== product._id));
      } else {
        setCart(
          cart.map((x) =>
            x._id === product._id? {...existItem, qty: newQty } : x
          )
        );
      }
    } else {
      if (qty > 0) {
        setCart([...cart, {...product, qty }]);
      }
    }
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id!== id));
  }

  const cartCount = cart.reduce((a, c) => a + c.qty, 0);
  const cartTotal = cart.reduce((a, c) => a + c.qty * c.price, 0);

  return (
    <CartContext.Provider value={{ cartItems: cart, addToCart, removeFromCart, clearCart: () => setCart([]), cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}