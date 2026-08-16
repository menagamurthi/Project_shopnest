# ShopNest - E-Commerce Store

A modern, full-stack e-commerce application built with React, Node.js, and MongoDB. Features a complete storefront with product catalog, shopping cart, checkout, order management, and admin dashboard.

## 🌟 Features

### Customer Features
- **Product Catalog** - Browse products with search and category filtering
- **Product Details** - View detailed product information with images and descriptions
- **Shopping Cart** - Add/remove items, update quantities (Redux-based cart state)
- **Checkout** - Secure checkout with shipping address and payment methods
- **Payment Methods** - Support for Cash On Delivery (COD) and Razorpay integration
- **Order Management** - Track order status and view order history
- **User Authentication** - Secure login/register with JWT tokens
- **LocalStorage Sync** - Cart and auth data persisted across sessions

### Admin Features
- **Dashboard** - Real-time KPI cards (products, orders, users, revenue)
- **Product Management** - Create, edit, delete products with image uploads
- **Order Management** - View all orders, update order status (Processing → Shipped → Delivered)
- **User Management** - View all users and admin status
- **Search & Pagination** - Filter orders by customer name or order ID with pagination

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **MUI (Material-UI)** - Premium component library
- **Redux Toolkit** - State management for cart
- **React Router** - Client-side routing
- **Axios** - API client
- **React Toastify** - Toast notifications

### Backend
- **Node.js & Express** - Server and API
- **MongoDB** - NoSQL database
- **JWT** - Authentication and authorization
- **Razorpay** - Payment gateway integration
- **Multer** - File upload handling
- **Cors** - Cross-origin request handling

## 📋 Prerequisites

- Node.js v14+
- MongoDB running locally (localhost:27017)
- npm or yarn package manager
- Razorpay account (for online payments)

## ⚙️ Installation

### 1. Clone & Setup
```bash
cd shopnest
npm install
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
MONGO_URI=mongodb://localhost:27017/shopnest
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
VITE_API_URL=http://localhost:5000
```

## 🚀 Running the Application

### Start MongoDB
```bash
mongosh
```

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### Build for Production
```bash
cd frontend
npm run build
# Creates optimized build in dist/
```

## 📁 Project Structure

```
shopnest/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── productModel.js
│   │   └── orderModel.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── upload.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── CartScreen.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   └── OrderDetails.jsx
│   │   ├── screens/admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ProductListScreen.jsx
│   │   │   ├── ProductCreateScreen.jsx
│   │   │   ├── ProductEditScreen.jsx
│   │   │   ├── UserListScreen.jsx
│   │   │   └── AdminOrders.jsx
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── cartSlice.js
│   │   ├── api.js
│   │   ├── theme.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔑 Key Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `GET /api/products/categories` - Get all categories

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (admin)
- `POST /api/orders/:id/pay` - Create Razorpay payment
- `POST /api/orders/:id/verify` - Verify payment
- `DELETE /api/orders/:id` - Cancel order

### Users
- `GET /api/users` - Get all users (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Admin
- `GET /api/orders/stats` - Dashboard statistics

### Upload
- `POST /api/upload` - Upload product image

## 🔐 Authentication & Authorization

- **JWT Tokens** - Used for user authentication
- **Role-Based Access** - Admin users can access admin routes
- **Protected Routes** - Frontend AdminRoute component restricts unauthorized access
- **Token Storage** - Auth data stored in localStorage

## 🛒 Cart State Management

- **Redux Toolkit** - Central state management for cart
- **localStorage Sync** - Cart persists across sessions
- **CartContext Hook** - Wrapper around Redux for easy access
- **Actions** - addItem, removeItem, updateQty, clearCart

## 💳 Payment Integration

### Razorpay
1. Order created with `paymentMethod: "Razorpay"`
2. Frontend initiates Razorpay payment dialog
3. User completes payment
4. Webhook verifies signature and updates order status
5. Order marked as paid

### Cash On Delivery (COD)
1. Order created with `paymentMethod: "COD"`
2. `isPaid` flag remains false
3. Admin can mark as delivered after receipt

## 📦 Deployment Ready

- ✅ Production build optimized
- ✅ CORS configured for cross-origin requests
- ✅ Static file serving for uploads
- ✅ Environment variables for secrets
- ✅ Error handling and validation
- ✅ Responsive design for all devices

## 🚧 Future Enhancements

- [ ] Payment with Stripe integration
- [ ] Email notifications for orders
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Coupon and discount codes
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Mobile app (React Native)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Built with ❤️ using React, Node.js, and MongoDB**
