import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'

function App() {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage
    const saved = localStorage.getItem('cartItems')
    return saved? JSON.parse(saved) : []
  })

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item) => {
    const exist = cartItems.find(x => x._id === item._id)
    if (exist) {
      setCartItems(cartItems.map(x => x._id === item._id? item : x))
    } else {
      setCartItems([...cartItems, item])
    }
  }

  return (
    <Router>
      <Header cartItems={cartItems} />
      <main>
        <Routes>
          <Route path='/' element={<HomeScreen />} />
          <Route path='/product/:id' element={<ProductScreen addToCart={addToCart} />} />
          <Route path='/cart' element={<CartScreen cartItems={cartItems} />} />
        </Routes>
      </main>
    </Router>
  )
}
export default App