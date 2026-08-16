import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TextField, Button, Box, Typography, Paper, Container, CircularProgress, MenuItem } from '@mui/material'
import { ArrowBack, CloudUpload } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useAuth } from "../../context/AuthContext";
import API from '../../api'

const categories = ['Shoes', 'Electronics', 'Clothing', 'Accessories', 'Home'];

const ProductCreateScreen = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { userInfo } = useAuth()

  useEffect(() => {
    if (!userInfo ||!userInfo.isAdmin) {
      navigate('/login')
    }
  }, [userInfo, navigate])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const { data } = await API.post('/upload', formData, config)
      setImage(data.image)
      setUploading(false)
      toast.success('Image Uploaded')
    } catch (error) {
      setUploading(false)
      toast.error(error.response?.data?.message || 'Upload failed')
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post(`/products`, { name, price, image, brand, category, description, countInStock })
      toast.success('Product Created')
      navigate('/admin/products')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Create failed')
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, pb: 5 }}>
      <Button component={Link} to='/admin/products' startIcon={<ArrowBack />} sx={{ mb: 2 }}>
        Back to Products
      </Button>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>Create Product</Typography>
        <Box component="form" onSubmit={submitHandler}>
          <TextField label="Product Name" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Price (₹)" type="number" fullWidth margin="normal" value={price} onChange={(e) => setPrice(e.target.value)} required inputProps={{ step: "0.01" }} />

          <TextField label="Image URL" fullWidth margin="normal" value={image} onChange={(e) => setImage(e.target.value)} />
          <Button variant="outlined" component="label" startIcon={<CloudUpload />} disabled={uploading} sx={{mb: 2, mt: 1}}>
            {uploading? <CircularProgress size={20}/> : 'Upload Image'}
            <input type="file" hidden onChange={uploadFileHandler} />
          </Button>
          {image && <Box sx={{textAlign: 'center', mb: 2}}><img src={image} alt="preview" style={{width: '120px', height: '120px', objectFit: 'cover', borderRadius: 8}}/></Box>}

          <TextField label="Brand" fullWidth margin="normal" value={brand} onChange={(e) => setBrand(e.target.value)} required />
          <TextField select label="Category" fullWidth margin="normal" value={category} onChange={(e) => setCategory(e.target.value)} required>
            {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>
          <TextField label="Stock Count" type="number" fullWidth margin="normal" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
          <TextField label="Description" multiline rows={4} fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5, fontSize: 16 }} disabled={loading}>
            {loading? 'Creating...' : 'Create Product'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
export default ProductCreateScreen