import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, CircularProgress, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAuth } from "../../context/AuthContext";
import { getProducts, deleteProduct, createProduct } from '../../api' 

const ProductListScreen = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { userInfo } = useAuth()

  const isAdmin = userInfo?.user?.isAdmin || userInfo?.isAdmin;

  const createProductHandler = async () => {
    try {
      const { data } = await createProduct()
      toast.success('Product Created')
      navigate(`/admin/product/${data._id}/edit`)
    } catch (error) {
      toast.error('Create failed')
    }
  }

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
    fetchProducts()
  }, [userInfo, navigate, isAdmin])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data } = await getProducts()
      setProducts(data)
    } catch (error) {
      console.log(error)
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteProduct(id)
        toast.success('Product removed')
        fetchProducts()
      } catch (error) {
        toast.error('Delete failed')
      }
    }
  }

  if (loading) return (
    <Box sx={{display: 'flex', justifyContent: 'center', mt: 5}}>
      <CircularProgress />
    </Box>
  )

  return (
    <Container sx={{py: 5}}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Products ({products.length})</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={createProductHandler} sx={{ py: 1.5 }}>
          Create Product
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>NAME</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>PRICE</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>CATEGORY</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>BRAND</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                <TableCell>{product._id.substring(0, 10)}...</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>
                  <IconButton component={Link} to={`/admin/product/${product._id}/edit`} color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteHandler(product._id)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}
export default ProductListScreen