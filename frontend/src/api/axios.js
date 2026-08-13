import axios from 'axios'

const API = axios.create({
  baseURL: '/api'  // because proxy handles localhost:5000
})

export default API