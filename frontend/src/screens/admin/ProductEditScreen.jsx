import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { TextField, Button, Box, Typography, Paper, Container } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useAuth } from "../../context/AuthContext";
import API from '../../api' // ADD TOP


// Get



const ProductEditScreen = () => {
  const { id: productId } = useParams()
  const navigate = useNavigate()
  const { userInfo } = useAuth(); 

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('') // <-- ADDED THIS
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${productId}`)
        setName(data.name)
        setPrice(data.price)
        setImage(data.image)
        setBrand(data.brand) // <-- ADDED THIS
        setCategory(data.category)
        setDescription(data.description)
        setCountInStock(data.countInStock)
      } catch (error) {
        toast.error(error.response?.data?.message || error.message)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [productId])

const submitHandler = async (e) => {
  e.preventDefault()
  try {
    await API.put(`/products/${productId}`, { 
      name, price, image, brand, category, countInStock, description 
    })
    toast.success('Product Updated')
    navigate('/admin/products')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Update failed')
  }
}

  if(loading) return <h2>Loading...</h2>

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button component={Link} to='/admin/products' startIcon={<ArrowBack />} sx={{ mb: 2 }}>
        Go Back
      </Button>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Edit Product</Typography>
        <Box component="form" onSubmit={submitHandler}>
          <TextField label="Name" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Price" type="number" fullWidth margin="normal" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <TextField label="Image URL" fullWidth margin="normal" value={image} onChange={(e) => setImage(e.target.value)} />
          <TextField label="Brand" fullWidth margin="normal" value={brand} onChange={(e) => setBrand(e.target.value)} /> {/* <-- ADDED THIS */}
          <TextField label="Category" fullWidth margin="normal" value={category} onChange={(e) => setCategory(e.target.value)} />
          <TextField label="Count In Stock" type="number" fullWidth margin="normal" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
          <TextField label="Description" multiline rows={3} fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Update</Button>
        </Box>
      </Paper>
    </Container>
  )
}
export default ProductEditScreen