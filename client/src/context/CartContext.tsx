import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  _id: string; name: string; price: number; image: string; qty: number; countInStock: number; // added countInStock
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void; // ADD THIS
  updateQty: (id: string, qty: number) => void; // ADD THIS
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const itemsFromStorage = localStorage.getItem("cartItems");
    return itemsFromStorage? JSON.parse(itemsFromStorage) : [];
  });

  // Only 1 useEffect to save
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    const exist = cartItems.find((x) => x._id === item._id);
    if (exist) {
      // Don't go over stock
      const newQty = exist.qty + 1;
      setCartItems(
        cartItems.map((x) => x._id === item._id? {...exist, qty: newQty > item.countInStock? item.countInStock : newQty } : x)
      );
    } else {
      setCartItems([...cartItems, {...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((x) => x._id!== id));
  };

  const updateQty = (id: string, qty: number) => {
    setCartItems(cartItems.map((x) => x._id === id? {...x, qty} : x));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};