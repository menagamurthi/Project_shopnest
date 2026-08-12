import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext"; // 1. Only 1 import

interface Product {
  _id: string; name: string; price: number; image: string;
  description: string; brand: string; category: string; countInStock: number;
}

const ProductScreen = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const { id } = useParams();
  
  const { addToCart } = useCart()!; // 2. MUST be INSIDE the component

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  return (
    <>
      <Link to="/" className="btn btn-light my-3">Go Back</Link>
      <Row>
        <Col md={6}><Image src={product.image} alt={product.name} fluid /></Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item><h3>{product.name}</h3></ListGroup.Item>
            <ListGroup.Item>Brand: {product.brand}</ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item><Row><Col>Price:</Col><Col><strong>₹{product.price}</strong></Col></Row></ListGroup.Item>
              <ListGroup.Item><Row><Col>Status:</Col><Col>{product.countInStock > 0? 'In Stock' : 'Out Of Stock'}</Col></Row></ListGroup.Item>
              <ListGroup.Item>
               <Button 
                 className="w-100" 
                 disabled={product.countInStock === 0}
                 onClick={() => addToCart(product)} // 3. Wire it to real cart
               >
                 Add To Cart
               </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default ProductScreen;