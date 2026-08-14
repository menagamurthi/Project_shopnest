import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

const HomeScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get(`http://${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
<Card className="my-3 p-3 rounded h-100">
  <Link to={`/product/${product._id}`}>
   <Card.Img src={product.image}  variant="top"  style={{height: '200px', objectFit: 'cover'}} />

  </Link>
  <Card.Body className="d-flex flex-column">
    <Link to={`/product/${product._id}`}>
      <Card.Title as="div">
        <strong>{product.name}</strong>
      </Card.Title>
    </Link>
    <Card.Text as="h3">₹{product.price}</Card.Text>
    <Link to={`/product/${product._id}`} className="btn btn-dark w-100 mt-auto">
      View Details
    </Link>
  </Card.Body>
</Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;