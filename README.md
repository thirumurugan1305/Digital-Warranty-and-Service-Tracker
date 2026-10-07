# Digital Warranty & Product Service Tracker

[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Express%20%7C%20MongoDB-blue.svg)](https://github.com/)
[![Cost](https://img.shields.io/badge/Cost-%E2%82%B90%20Zero%20Paid%20APIs-emerald.svg)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

A portfolio-ready, full-stack web application designed to digitally organize consumer products, track warranty periods and expiration dates automatically, maintain detailed repair and service logs, receive in-app notifications, and securely manage physical invoices and receipt documents.

---

## 📌 Problem Statement & Objectives

Managing consumer electronics, home appliances, and vehicle warranties with physical paper receipts is error-prone. Invoices fade, warranty cards get lost, and users miss repair claim windows before warranties expire.

**Digital Warranty Tracker** solves this by providing:
* **Automated Expiration Engine**: Automatically calculates exact warranty expiration dates based on purchase date + warranty duration (months) and tracks remaining coverage days.
* **Smart Status Evaluator**: Dynamically tags products as `ACTIVE`, `EXPIRING SOON`, or `EXPIRED`.
* **Service & Maintenance Ledger**: Maintains chronological repair records, service center contacts, repair status, and total out-of-pocket expenditure statistics.
* **Multi-Tenant Document Vault**: Securely uploads and streams purchase bills, warranty certificates, and service receipts using authenticated local file access.

---

## 💰 ₹0 Cost Guarantee

This application was engineered with a strict **₹0 cost requirement**:
* **Zero Paid APIs**: No reliance on paid cloud services, SMS gateways, or paid API credits.
* **Open Source & Local Infrastructure**: Powered entirely by React, Express, local MongoDB, Node.js, Tailwind CSS, Lucide icons, and local disk storage (`backend/uploads/`).
* **Authenticated Document Serving**: Local document files are streamed securely via Express handlers (`GET /api/documents/:productId/:filename`) without requiring paid S3 bucket storage.

---

## 🛠️ Technology Stack

### Frontend
* **Core**: React 18, Vite
* **Styling**: Tailwind CSS, Custom SaaS Design Tokens
* **Navigation**: React Router v6
* **Icons**: Lucide React
* **HTTP Client**: Axios with JWT Interceptors

### Backend
* **Runtime**: Node.js, Express.js
* **Database**: MongoDB & Mongoose ORM
* **Authentication**: JWT (JSON Web Tokens), bcryptjs
* **File Processing**: Multer (Disk Storage)

---

## 📂 Project Architecture & Structure

```
digital-warranty-tracker/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       # Navbar, Sidebar, ProductCard, WarrantyBadge, Modal
│   │   ├── context/          # AuthContext, ProductContext
│   │   ├── pages/            # Dashboard, MyProducts, AddProduct, Details, ServiceHistory, Documents, Notifications, Settings
│   │   ├── services/         # Axios API Client with JWT interceptors
│   │   ├── App.jsx           # App routing & providers
│   │   ├── main.jsx
│   │   └── index.css         # Tailwind & SaaS design system
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/               # db.js (MongoDB local connection & diagnostics)
│   ├── controllers/          # authController, productController, serviceController, notificationController, documentController
│   ├── middleware/           # authMiddleware (JWT protect), uploadMiddleware (Multer filter)
│   ├── models/               # User, Product, ServiceRecord, Notification
│   ├── routes/               # authRoutes, productRoutes, serviceRoutes, notificationRoutes, documentRoutes
│   ├── services/             # warrantyService, notificationService, authService, productService, serviceRecordService
│   ├── tests/                # run_tests.js, fullstack_integration_test.js, mongo_live_check.js
│   ├── uploads/              # Protected local document files
│   ├── server.js             # Express entry point
│   └── .env                  # Environment variables
│
├── README.md
├── PROJECT_STATUS.md
└── package.json              # Root script runner
```

---

## 🔐 Security & Data Isolation Audit

1. **Password Encryption**: All passwords are salted and hashed using `bcryptjs` (salt rounds 10). Raw passwords are never stored or returned in API responses.
2. **JWT Authorization**: API routes check the HTTP header `Authorization: Bearer <token>`.
3. **Tenant Isolation**: Database queries enforce `{ userId: req.user._id }`. Users cannot read, modify, or delete another user's products or service records.
4. **Document Access Protection**: Documents are not exposed via raw static folders. The route `GET /api/documents/:productId/:filename` requires JWT authorization and verifies product ownership before streaming physical files.

---

## 📡 REST API Reference

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Public | System status & health diagnostic check |
| `/api/auth/register` | `POST` | Public | Create new account & return JWT |
| `/api/auth/login` | `POST` | Public | Authenticate user & return JWT |
| `/api/auth/me` | `GET` | User | Retrieve current user profile |
| `/api/products` | `GET` | User | Fetch all products owned by user |
| `/api/products` | `POST` | User | Register new product with warranty calculation |
| `/api/products/:id` | `GET` | User | Fetch product details (ownership enforced) |
| `/api/products/:id` | `PUT` | User | Update product details & recalculate warranty |
| `/api/products/:id` | `DELETE` | User | Delete product, service logs & attached files |
| `/api/products/:id/documents` | `POST` | User | Upload document attachment (PDF, JPEG, PNG, WEBP) |
| `/api/services` | `GET` | User | Fetch service records for user |
| `/api/services` | `POST` | User | Log repair or service entry |
| `/api/services/stats` | `GET` | User | Compute total repair expense metrics |
| `/api/notifications` | `GET` | User | Auto-scan warranties & return alerts |
| `/api/notifications/read-all` | `PUT` | User | Mark all user notifications as read |
| `/api/documents/:productId/:filename` | `GET` | User | Securely stream uploaded document file |

---

## ⚡ Quick Start & Installation

### Prerequisites
* **Node.js** (v18+ recommended)
* **MongoDB** installed and running locally on `mongodb://127.0.0.1:27017`

### 1. Clone & Install Dependencies

```bash
# Clone repository
cd digital-warranty-tracker

# Install root, backend, and frontend dependencies
npm run install:all
```

### 2. Configure Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/warranty_tracker
JWT_SECRET=warranty_tracker_super_secret_jwt_key_2026
EXPIRING_SOON_DAYS=30
NODE_ENV=development
```

### 3. Start Local MongoDB

```bash
# Windows
net start MongoDB
# Or run mongod directly
mongod
```

### 4. Launch Backend and Frontend

```bash
# Terminal 1: Backend Server (Port 5000)
cd backend
npm run dev

# Terminal 2: Frontend Vite Server (Port 5173)
cd frontend
npm run dev
```

Open browser at `http://localhost:5173`

---

## 🧪 Testing Suite

```bash
# Run unit and security tests
cd backend
node tests/run_tests.js

# Run full-stack security & tenant isolation checks
node tests/fullstack_integration_test.js

# Run live MongoDB connection test
node tests/mongo_live_check.js

# Verify frontend production build
cd frontend
npm run build
```

---

## 📝 License & Acknowledgments

Built for the **Digital Warranty & Product Service Tracker** project under ₹0 cost open-source guidelines. MIT License.
