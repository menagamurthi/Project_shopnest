import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { TextField, Button, Box, Typography, Paper, Container, CircularProgress, MenuItem } from '@mui/material'
import { ArrowBack, CloudUpload } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useAuth } from "../../context/AuthContext";
import API from '../../api'

const categories = ['Shoes', 'Electronics', 'Clothing', 'Accessories', 'Home', 'Kids'];

const ProductEditScreen = () => {
  const { id: productId } = useParams()
  const navigate = useNavigate()
  const { userInfo } = useAuth();

  const isAdmin = userInfo?.user?.isAdmin || userInfo?.isAdmin;
  const token = userInfo?.user?.token || userInfo?.token;

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!userInfo) {
      toast.error('Please login first')
      navigate('/login')
      return
    }
    if (!isAdmin) {
      toast.error('Not Authorized as Admin')
      navigate('/')
      return
    }
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${productId}`)
        setName(data.name)
        setPrice(data.price)
        setImage(data.image)
        setBrand(data.brand)
        setCategory(data.category)
        setDescription(data.description)
        setCountInStock(data.countInStock)
      } catch (error) {
        toast.error(error.response?.data?.message || error.message)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [productId, userInfo, navigate, isAdmin])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await API.post('/upload', formData, config)
      setImage(data.image)
      setUploading(false)
      toast.success('Image Uploaded')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Upload failed')
      setUploading(false)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await API.put(`/products/${productId}`, {
        name, price, image, brand, category, countInStock, description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Product Updated')
      navigate('/admin/products')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    }
  }

  if(loading) return (
    <Box sx={{display: 'flex', justifyContent: 'center', mt: 5}}>
      <CircularProgress />
    </Box>
  )

  return (
    <Container maxWidth="sm" sx={{ mt: 4, pb: 5 }}>
      <Button component={Link} to='/admin/products' startIcon={<ArrowBack />} sx={{ mb: 2 }}>
        Back to Products
      </Button>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>Edit Product</Typography>
        <Box component="form" onSubmit={submitHandler}>
          <TextField label="Product Name" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Price (₹)" type="number" fullWidth margin="normal" value={price} onChange={(e) => setPrice(e.target.value)} required inputProps={{ step: "0.01" }} />

          <TextField label="Image URL" fullWidth margin="normal" value={image} onChange={(e) => setImage(e.target.value)} />

          <Button variant="outlined" component="label" startIcon={<CloudUpload />} disabled={uploading} sx={{mb: 2, mt: 1}}>
            {uploading? <CircularProgress size={20}/> : 'Upload Image'}
            <input type="file" hidden onChange={uploadFileHandler} />
          </Button>
          {image && <Box sx={{textAlign: 'center', mb: 2}}><img src={image} alt="preview" style={{width: '120px', height: '120px', objectFit: 'cover', borderRadius: 8}}/></Box>}

          <TextField label="Brand" fullWidth margin="normal" value={brand} onChange={(e) => setBrand(e.target.value)} />
          <TextField select label="Category" fullWidth margin="normal" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>
          <TextField label="Stock Count" type="number" fullWidth margin="normal" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
          <TextField label="Description" multiline rows={4} fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5, fontSize: 16 }}>Update Product</Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default ProductEditScreen