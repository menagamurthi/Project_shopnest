import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

const CartScreen = () => {
  const { cartItems = [], removeFromCart, cartCount, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0? (
          <p>Your cart is empty <Link to='/'>Go Back</Link></p>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>₹{item.price}</Col>
                  <Col md={2}>Qty: {item.qty}</Col>
                  <Col md={2}>
                    <Button variant='light' size='sm' onClick={() => removeFromCart(item._id)}>
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Subtotal ({cartCount}) items</h2>
              ₹{cartTotal.toFixed(2)}
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};
export default CartScreen;