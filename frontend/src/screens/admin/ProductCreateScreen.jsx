import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { TextField, Button, Box, Typography, Paper, Container } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { toast } from 'react-toastify'
import API from '../api'; // ADD TOP
const ProductCreateScreen = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [uploading, setUploading] = useState(false) // ADD THIS
  const navigate = useNavigate()




  // MOVE THIS INSIDE THE COMPONENT
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
// Upload
const { data } = await API.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

      setImage(data) // sets /uploads/image-xxx.jpg
      setUploading(false)
      toast.success('Image Uploaded')
    } catch (error) {
      setUploading(false)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
// Create
await API.post(`/products`, { name, price, image, category, description, countInStock })
    toast.success('Product Created')
    navigate('/admin/products')
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button component={Link} to='/admin/products' startIcon={<ArrowBack />} sx={{ mb: 2 }}>
        Go Back
      </Button>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Add Product</Typography>
        <Box component="form" onSubmit={submitHandler}>
          <TextField label="Name" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Price" type="number" fullWidth margin="normal" value={price} onChange={(e) => setPrice(e.target.value)} required />
          
          <TextField label="Image URL" fullWidth margin="normal" value={image} onChange={(e) => setImage(e.target.value)} />
<Button variant="outlined" component="label" sx={{mt:1}}>
  Upload Image
  <input type="file" hidden onChange={uploadFileHandler} />
</Button>

{uploading && <Typography sx={{mt:1}}>Uploading...</Typography>}

{/* PREVIEW */}
{image && (
  <Box sx={{mt:2, textAlign: 'center'}}>
    <Typography variant="caption" display="block" gutterBottom>Preview:</Typography>
    <Paper sx={{p:1, display: 'inline-block'}}>
      <img 
        src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${image}`} // FIX 
        alt="preview" 
        style={{width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px'}} 
      />
    </Paper>
  </Box>
)}

          <TextField label="Category" fullWidth margin="normal" value={category} onChange={(e) => setCategory(e.target.value)} />
          <TextField label="Count In Stock" type="number" fullWidth margin="normal" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
          <TextField label="Description" multiline rows={3} fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Create</Button>
        </Box>
      </Paper>
    </Container>
  )
}
export default ProductCreateScreen