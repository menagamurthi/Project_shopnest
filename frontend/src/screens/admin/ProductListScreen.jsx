import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { getProducts, deleteProduct } from '../../api' // <-- MUKKIYAM: api.js import

const ProductListScreen = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await getProducts() // <-- axios.get illa
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error('Failed to fetch products')
      setLoading(false)
    }
  }

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteProduct(id) // <-- api.js function use panniten
        toast.success('Product removed')
        fetchProducts()
      } catch (error) {
        toast.error('Delete failed')
      }
    }
  }

  if (loading) return <Typography sx={{p:4}}>Loading...</Typography>

  return (
    <Container sx={{py: 4}}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 3}}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/admin/product/create')}>
          Create Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>NAME</TableCell>
              <TableCell>PRICE</TableCell>
              <TableCell>CATEGORY</TableCell>
              <TableCell>BRAND</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product._id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/admin/product/${product._id}/edit`}><EditIcon /></Button>
                  <Button onClick={() => deleteHandler(product._id)}><DeleteIcon /></Button>
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