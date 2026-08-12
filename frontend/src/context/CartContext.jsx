import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty) => {
    const existItem = cart.find((x) => x._id === product._id);

    if (existItem) {
      const newQty = existItem.qty + qty;
      
      if (newQty <= 0) {
        // Remove item if qty becomes 0 or less
        setCart(cart.filter((x) => x._id!== product._id));
      } else {
        // Update qty
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

  const clearCart = (id) => {
    if(id) setCart(prev => prev.filter(item => item._id!== id));
    else setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

