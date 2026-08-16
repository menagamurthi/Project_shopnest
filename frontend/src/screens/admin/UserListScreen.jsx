import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import API from '../../api'
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, CircularProgress, IconButton, Chip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

const UserListScreen = () => {
  const navigate = useNavigate()
  const { userInfo } = useAuth()
  const token = userInfo?.user?.token || userInfo?.token;
  const isAdmin = userInfo?.user?.isAdmin || userInfo?.isAdmin;

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userInfo || !isAdmin) {
      navigate('/login')
    } else {
      fetchUsers()
    }
  }, [userInfo, isAdmin, navigate])

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const deleteHandler = async (id) => {
    if(window.confirm('Are you sure?')){
      try {
        await API.delete(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('User deleted')
        fetchUsers()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error')
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
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>Users ({users.length})</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>NAME</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>EMAIL</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ADMIN</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                <TableCell>{user._id.substring(0, 10)}...</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell><a href={`mailto:${user.email}`} style={{color: '#2563eb', textDecoration: 'none'}}>{user.email}</a></TableCell>
                <TableCell>
                  {user.isAdmin ? (
                    <Chip icon={<CheckCircleIcon />} label="Admin" color="success" size="small" />
                  ) : (
                    <Chip icon={<CancelIcon />} label="User" color="default" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => deleteHandler(user._id)} color="error" size="small">
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
export default UserListScreen