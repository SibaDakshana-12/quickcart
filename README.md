# QuickCart 🛒

A full-stack e-commerce web application with real-time order tracking.

## Live Demo
- Frontend: https://quickcart-siba.netlify.app
- Backend API: https://quickcart-api-zoje.onrender.com

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Socket.io Client (Real-time)
- Live Server

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Socket.io
- bcryptjs

## Features
- User Registration and Login (JWT Auth)
- Product Listings with Search, Filter and Sort
- Product Detail Page with Stock Status
- Shopping Cart with Quantity Management
- Secure Checkout with Shipping Details
- Real-time Order Tracking (Socket.io)
- Admin Panel with Order Management
- Order History and Status Updates
- Cancel Order functionality
- Responsive Design

## Project Structure
quickcart/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
├── css/
│   └── style.css
├── js/
│   ├── auth.js
│   ├── products.js
│   └── socket.js
├── index.html
├── products.html
├── product.html
├── cart.html
├── checkout.html
├── profile.html
├── admin.html
└── 404.html

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login user |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/products | Public | Get all products |
| GET | /api/products/:id | Public | Get single product |
| POST | /api/products | Admin | Add product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |

### Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/orders | User | Place order |
| GET | /api/orders/myorders | User | Get my orders |
| GET | /api/orders/:id | User | Get single order |
| GET | /api/orders | Admin | Get all orders |
| PUT | /api/orders/:id/status | Admin | Update status |
| PUT | /api/orders/:id/cancel | User | Cancel order |

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
```
Create .env file:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Run backend:
```bash
npm run dev
```

### Frontend Setup
- Open frontend folder in VS Code
- Right click index.html
- Click Open with Live Server

## Real-Time Feature
QuickCart uses Socket.io for real-time order tracking.
When admin updates order status — customer sees it
instantly without refreshing the page.

## Developed By
Siba — Full Stack Developer
GitHub: https://github.com/Sibadakshana-12