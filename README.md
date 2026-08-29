# 🛒 QuickCart — Full-Stack E-Commerce Platform

> A modern full-stack e-commerce web application with **JWT-based authentication, role-based access control, real-time order tracking, product management, and an admin dashboard**.

**QuickCart** provides a complete shopping experience — from user authentication and product discovery to checkout, order management, and real-time delivery status updates.

---

## 🌐 Live Demo

| Service            | Link                                    |
| ------------------ | --------------------------------------- |
| 🖥️ **Frontend**   | https://quickcart-siba.netlify.app      |
| ⚙️ **Backend API** | https://quickcart-api-zoje.onrender.com |

---

## ✨ Features

### 👤 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Secure password hashing using `bcryptjs`
* Protected routes and API endpoints
* Role-based access control for users and administrators

### 🛍️ Product Management

* Browse available products
* Search products by name
* Filter and sort products
* Detailed product information
* Real-time stock availability
* Admin **Add / Edit / Delete** product management

### 🛒 Shopping Cart

* Add products to cart
* Increase/decrease product quantities
* Remove products from cart
* Automatic cart total calculation
* Stock-aware quantity management

### 💳 Checkout & Orders

* Secure checkout flow
* Shipping address collection
* Order creation and validation
* Order history for users
* Individual order details
* Order cancellation functionality

### 📦 Real-Time Order Tracking

* Real-time order status updates using **Socket.io**
* Customers receive status changes without refreshing the page
* Visual **order-tracking progress bar**
* Admin can update order status from the dashboard

### 🛠️ Admin Dashboard

* View all customer orders
* Manage order statuses
* Add new products
* Edit existing products
* Delete products
* Monitor order management from a centralized interface

### 📱 Responsive UI

* Responsive design for desktop, tablet, and mobile screens
* Clean and intuitive shopping interface

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      QuickCart       │
                    │    Frontend Client   │
                    │ HTML/CSS/JavaScript  │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
            REST API                    Socket.io
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │  Express.js     │        │ Real-Time       │
        │  Backend        │        │ Communication   │
        └────────┬────────┘        └────────┬────────┘
                 │                           │
        ┌────────┴────────┐                  │
        │                 │                  │
        ▼                 ▼                  │
   JWT Auth          MongoDB Atlas           │
        │                 │                  │
        └─────────────────┴──────────────────┘
                          │
                          ▼
                  Persistent Data
```

### Request Flow

```text
User
 │
 ▼
Frontend
 │
 ├── REST API ──────► Express.js ──────► MongoDB
 │
 └── Socket.io ─────► Real-Time Events
                           │
                           ▼
                    Order Status Update
                           │
                           ▼
                    Customer Interface
```

---

## 🔄 Order Tracking Workflow

QuickCart uses **Socket.io** to provide real-time order status updates.

```text
Customer places order
        │
        ▼
Order stored in MongoDB
        │
        ▼
Admin views order
        │
        ▼
Admin updates status
        │
        ▼
Socket.io emits event
        │
        ▼
Customer receives update
        │
        ▼
Tracking progress bar updates
        │
        ▼
No page refresh required
```

### Order Lifecycle

```text
Placed
  ↓
Processing
  ↓
Shipped
  ↓
Out for Delivery
  ↓
Delivered
```

Customers can monitor the current stage of their order directly from the order-tracking interface.

---

## 🔐 Security

QuickCart implements several security mechanisms:

* **JWT Authentication** for secure user sessions
* **bcryptjs** for password hashing
* **Role-Based Access Control (RBAC)** for admin-only operations
* Protected API routes through authentication middleware
* Server-side authorization checks
* Environment variables for sensitive configuration

Sensitive credentials such as database connection strings and JWT secrets are stored in environment variables rather than hard-coded into the application.

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Socket.io Client
* Live Server

### Backend

* Node.js
* Express.js
* Socket.io
* JWT
* bcryptjs

### Database

* MongoDB
* MongoDB Atlas

### Deployment

* Netlify — Frontend
* Render — Backend API
* MongoDB Atlas — Database

---

## 📁 Project Structure

```text
QuickCart/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── socket.js
│   │
│   ├── 404.html
│   ├── admin.html
│   ├── cart.html
│   ├── checkout.html
│   ├── index.html
│   ├── login.html
│   ├── product.html
│   ├── products.html
│   ├── profile.html
│   └── register.html
│
├── .gitignore
└── README.md
```

---

# 🔌 REST API

## 🔑 Authentication

| Method | Endpoint             | Access | Description                      |
| ------ | -------------------- | ------ | -------------------------------- |
| `POST` | `/api/auth/register` | Public | Register a new user              |
| `POST` | `/api/auth/login`    | Public | Authenticate user and return JWT |

---

## 🛍️ Products

| Method   | Endpoint            | Access | Description                |
| -------- | ------------------- | ------ | -------------------------- |
| `GET`    | `/api/products`     | Public | Retrieve all products      |
| `GET`    | `/api/products/:id` | Public | Retrieve a single product  |
| `POST`   | `/api/products`     | Admin  | Add a new product          |
| `PUT`    | `/api/products/:id` | Admin  | Update an existing product |
| `DELETE` | `/api/products/:id` | Admin  | Delete a product           |

---

## 📦 Orders

| Method | Endpoint                 | Access | Description               |
| ------ | ------------------------ | ------ | ------------------------- |
| `POST` | `/api/orders`            | User   | Place a new order         |
| `GET`  | `/api/orders/myorders`   | User   | Retrieve user's orders    |
| `GET`  | `/api/orders/:id`        | User   | Retrieve a specific order |
| `GET`  | `/api/orders`            | Admin  | Retrieve all orders       |
| `PUT`  | `/api/orders/:id/status` | Admin  | Update order status       |
| `PUT`  | `/api/orders/:id/cancel` | User   | Cancel an order           |

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/)
* npm
* MongoDB Atlas account
* VS Code
* Live Server extension

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/SibaDakshana-12/QuickCart.git
cd QuickCart
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5000
```

---

## 3️⃣ Frontend Setup

Open the `frontend` directory in VS Code.

Then:

```text
Right Click → index.html → Open with Live Server
```

The frontend will open in your browser through the Live Server development environment.

---

# 🔑 Environment Variables

The backend requires the following environment variables:

| Variable     | Description                           |
| ------------ | ------------------------------------- |
| `PORT`       | Port on which the Express server runs |
| `MONGO_URI`  | MongoDB Atlas connection string       |
| `JWT_SECRET` | Secret key used to sign JWT tokens    |

> ⚠️ Never commit your `.env` file or expose database credentials and JWT secrets publicly.

---

# 🧪 Testing the API

You can test the REST API using tools such as:

* Thunder Client
* Postman
* Browser developer tools

Example:

```http
GET /api/products
```

For protected endpoints, include the JWT token in the request authorization header.

---

# 📸 Screenshots

> Add screenshots of the major application interfaces here.

Recommended screenshots:

* 🏠 Home Page
* 🛍️ Product Listing
* 🔎 Product Details
* 🛒 Shopping Cart
* 💳 Checkout
* 📦 Order Tracking
* 🛠️ Admin Dashboard
* ✏️ Product Management

Example:

```markdown
## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Product Listing
![Products](screenshots/products.png)

### Order Tracking
![Order Tracking](screenshots/order-tracking.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin.png)
```

---

# 🚀 Deployment

QuickCart is deployed using:

```text
Frontend
   │
   ▼
Netlify
   │
   │ REST API / Socket.io
   ▼
Render
   │
   ▼
MongoDB Atlas
```

### Deployment Services

* **Frontend:** Netlify
* **Backend:** Render
* **Database:** MongoDB Atlas

The application is available as a live deployed system rather than only a local development project.

---

# 💡 Engineering Highlights

QuickCart was designed to demonstrate practical full-stack development concepts rather than only basic CRUD functionality.

### Authentication

JWT-based authentication is used to maintain secure user sessions and protect private API routes.

### Role-Based Access

Administrative operations such as product management and order status updates are restricted to authorized administrators.

### Real-Time Communication

Socket.io enables bidirectional communication between the server and connected clients, allowing customers to receive order status updates instantly.

### Database Design

MongoDB is used to persist:

```text
Users
Products
Orders
```

The backend separates these responsibilities through dedicated Mongoose models and Express routes.

### Separation of Concerns

The application separates:

```text
Frontend
   ↓
API Routes
   ↓
Middleware
   ↓
Models
   ↓
Database
```

This makes the codebase easier to maintain and extend.

---

# 🔮 Future Improvements

The current version focuses on building a solid core e-commerce system. The following features are planned for future development:

### 💳 Razorpay Payment Gateway

Integrate Razorpay for real payment processing, replacing the current mock payment flow.

### 📧 Email Notifications

Use Nodemailer to send:

* Order confirmation emails
* Order status updates
* Cancellation notifications

### ⭐ Product Ratings & Reviews

Allow verified customers to rate and review products they have purchased.

### 🎟️ Coupon & Discount System

Allow administrators to create discount codes and enable customers to apply coupons during checkout.

### 📊 Revenue Analytics Dashboard

Add interactive analytics for administrators, including:

* Daily/monthly revenue
* Sales trends
* Top-selling products
* Order statistics

### 📱 Progressive Web App

Convert QuickCart into a Progressive Web App with:

* Installable mobile experience
* Offline support
* Improved mobile usability

---

# 📌 Current Status

| Component                      | Status      |
| ------------------------------ | ----------- |
| User Authentication            | ✅ Completed |
| JWT Authorization              | ✅ Completed |
| Product Search / Filter / Sort | ✅ Completed |
| Shopping Cart                  | ✅ Completed |
| Checkout                       | ✅ Completed |
| Order Management               | ✅ Completed |
| Order Cancellation             | ✅ Completed |
| Real-Time Tracking             | ✅ Completed |
| Order Progress Bar             | ✅ Completed |
| Admin Dashboard                | ✅ Completed |
| Product CRUD from Admin UI     | ✅ Completed |
| Responsive UI                  | ✅ Completed |
| Backend Deployment             | ✅ Completed |
| Frontend Deployment            | ✅ Completed |
| Razorpay Integration           | 🔮 Planned  |
| Email Notifications            | 🔮 Planned  |
| Reviews & Ratings              | 🔮 Planned  |
| Coupons                        | 🔮 Planned  |
| Revenue Analytics              | 🔮 Planned  |
| PWA                            | 🔮 Planned  |

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit your changes
5. Push the branch
6. Open a Pull Request

---

# 📄 License

This project is developed for educational and portfolio purposes.
