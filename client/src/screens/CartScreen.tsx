import { Link } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button, Card, Form } from "react-bootstrap"; // Form added
import { useCart } from "../context/CartContext";

const CartScreen = () => {
  const { cartItems, removeFromCart, updateQty } = useCart()!;

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty <Link to="/">Go Back</Link></p>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row className="align-items-center">
                  <Col md={2}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                  <Col md={3}><Link to={`/product/${item._id}`}>{item.name}</Link></Col>
                  <Col md={2}>₹{item.price}</Col>
                  <Col md={2}>
                    <Form.Control 
                      as="select" 
                      value={item.qty}
                      onChange={(e) => updateQty(item._id, Number(e.target.value))}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button variant="light" onClick={() => removeFromCart(item._id)}>
                      <i className="fas fa-trash"></i> Delete
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
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
              ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button className="w-100" disabled={cartItems.length === 0}>
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};
export default CartScreen;