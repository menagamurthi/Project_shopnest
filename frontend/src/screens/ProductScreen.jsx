import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Row, Col, ListGroup, Card, Button, Image } from 'react-bootstrap'
import axios from 'axios'

const ProductScreen = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    axios.get(`http://localhost:5001/api/products/${id}`)
      .then(({ data }) => setProduct(data))
  }, [id])

  if(!product) return <h2>Loading...</h2>

  // KEY: Add backend URL + fix backslash
  const imageUrl = `http://localhost:5001${product.image.replace(/\\/g, '/')}`

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>BACK TO SHOP</Link>
      <Row>
        <Col md={6}>
          <Image src={imageUrl} alt={product.name} fluid style={{borderRadius: '8px'}} />
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item><h3>{product.name}</h3></ListGroup.Item>
            <ListGroup.Item><strong>Price:</strong> ₹{product.price}</ListGroup.Item>
            <ListGroup.Item><strong>Description:</strong> {product.description}</ListGroup.Item>
            <ListGroup.Item><strong>Category:</strong> {product.category}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item><Row><Col>Price:</Col><Col><strong>₹{product.price}</strong></Col></Row></ListGroup.Item>
              <ListGroup.Item><Row><Col>Status:</Col><Col>In Stock ({product.countInStock})</Col></Row></ListGroup.Item>
              <ListGroup.Item>
                <Button className='w-100' disabled={product.countInStock === 0}>
                  ADD TO CART
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}
export default ProductScreen