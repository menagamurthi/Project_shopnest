import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Header = () => {
  const { cartItems } = useCart()!;
  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0); // total items

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">ShopNest</Link>
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/cart">
              Cart({cartCount}) {/* This will show Cart(1), Cart(2) etc */}
            </Link>
            <Link className="nav-link" to="/login">Sign In</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Header;