import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')) : []
  )

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item) => {
    const exist = cartItems.find(x => x._id === item._id)
    if(exist) {
      setCartItems(cartItems.map(x => 
        x._id === item._id && x.qty < x.countInStock 
         ? {...x, qty: x.qty + 1} // <-- Always add +1
          : x
      ))
    } else {
      setCartItems([...cartItems, {...item, qty: 1}]) // <-- Always start with 1
    }
  }

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(x => x._id!== id))
  }

  const updateQty = (id, qty) => { // <-- NEW: for dropdown
    setCartItems(cartItems.map(x => 
      x._id === id? {...x, qty: Number(qty)} : x
    ))
  }

  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0)
  const cartTotal = cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  const clearCart = () => setCartItems([])

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, cartCount, cartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}