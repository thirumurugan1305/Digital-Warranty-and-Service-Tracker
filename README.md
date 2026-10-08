# Digital Warranty & Product Service Tracker

[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Express%20%7C%20MongoDB-blue.svg)](https://github.com/thirumurugan1305/Digital-Warranty-and-Service-Tracker)
[![Cost](https://img.shields.io/badge/Cost-%E2%82%B90%20%7C%20Zero%20Paid%20APIs-emerald.svg)](https://github.com/thirumurugan1305/Digital-Warranty-and-Service-Tracker)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

A full-stack web application for digitally managing consumer products, warranty periods, service history, repair expenses, notifications, and warranty-related documents.

---

## 📌 Problem Statement

Managing warranties for electronics, appliances, and other consumer products using physical invoices and warranty cards can be difficult.

Common problems include:

- Losing or damaging purchase invoices
- Forgetting warranty expiration dates
- Missing warranty claim periods
- Maintaining service and repair records manually
- Having no centralized place for warranty-related documents
- Difficulty tracking total repair expenses

The **Digital Warranty & Product Service Tracker** provides a centralized platform to manage all of this information digitally.

---

## 🎯 Objectives

The system is designed to:

- Digitally register and manage products
- Automatically calculate warranty expiration dates
- Identify active, expiring, and expired warranties
- Maintain service and repair history
- Track repair and maintenance expenses
- Generate in-app warranty notifications
- Securely store and access warranty-related documents
- Isolate each user's data using authenticated access

---

## ✨ Key Features

### 👤 User Authentication

- User registration and login
- Password hashing using `bcryptjs`
- JWT-based authentication
- Protected API routes
- Persistent authenticated sessions

### 📦 Product Management

- Add products with purchase and warranty information
- View all registered products
- Edit product information
- Delete products
- View detailed product information

### 🛡️ Warranty Tracking

The system automatically calculates warranty expiration based on:

```text
Purchase Date + Warranty Duration

Products are categorized as:

ACTIVE
EXPIRING SOON
EXPIRED

The default Expiring Soon threshold is 30 days.

🔧 Service & Repair History

Users can maintain service records containing:

Service date
Service center
Service description
Repair status
Repair cost
Additional notes

The application also provides expense statistics based on recorded service history.

🔔 Notifications

The application automatically checks warranty periods and provides in-app notifications for relevant warranty conditions.

📄 Document Management

Users can upload warranty-related documents such as:

Purchase invoices
Warranty certificates
Service receipts

Supported formats:

PDF
JPEG
PNG
WEBP

Maximum file size:

10 MB

Documents are accessed through authenticated backend routes rather than being exposed as a public static folder.

🏗️ System Architecture
                    ┌─────────────────────┐
                    │       User          │
                    │     Web Browser     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ React + Vite        │
                    │ Frontend            │
                    │ Tailwind CSS        │
                    └──────────┬──────────┘
                               │
                         Axios / HTTP
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │ REST API            │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌──────────┐    ┌──────────────┐   ┌────────────┐
        │   JWT    │    │   Mongoose   │   │   Multer   │
        │   Auth   │    │     ORM      │   │ File Upload│
        └──────────┘    └──────┬───────┘   └─────┬──────┘
                               │                 │
                               ▼                 ▼
                        ┌────────────┐     ┌─────────────┐
                        │  MongoDB   │     │   uploads/  │
                        │  Database  │     │   Storage   │
                        └────────────┘     └─────────────┘
🛠️ Technology Stack
Frontend
Technology	Purpose
React	User interface
Vite	Frontend development/build tool
Tailwind CSS	Styling and responsive UI
React Router	Client-side routing
Axios	API communication
Lucide React	UI icons
Backend
Technology	Purpose
Node.js	Server runtime
Express.js	REST API framework
Mongoose	MongoDB object modeling
JWT	Authentication and authorization
bcryptjs	Password hashing
Multer	Document upload handling
Database
MongoDB
MongoDB Atlas for deployed environment
Mongoose
📂 Project Structure
digital-warranty-tracker/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   ├── uploads/
│   ├── server.js
│   └── .env
│
├── README.md
├── PROJECT_STATUS.md
└── package.json
🔐 Security & Data Isolation

The application implements several security mechanisms.

Password Hashing

Passwords are hashed using bcryptjs before being stored in the database.

Raw passwords are not stored as plain text.

JWT Authentication

Protected API requests require a JWT:

Authorization: Bearer <token>
User-Level Data Isolation

Database operations for user-owned resources are scoped using the authenticated user's ID.

For example:

{ userId: req.user._id }

This prevents one authenticated user from accessing another user's products and service records.

Protected Documents

Uploaded documents are not served through a public static directory.

Document access requires:

A valid JWT
A valid product ID
Ownership of the product
A matching document record
📡 REST API
Endpoint	Method	Authentication	Description
/api/health	GET	Public	API health check
/api/auth/register	POST	Public	Register a user
/api/auth/login	POST	Public	Authenticate a user
/api/auth/me	GET	Required	Get current user
/api/products	GET	Required	Get user's products
/api/products	POST	Required	Create a product
/api/products/:id	GET	Required	Get product details
/api/products/:id	PUT	Required	Update product
/api/products/:id	DELETE	Required	Delete product
/api/products/:id/documents	POST	Required	Upload product document
/api/services	GET	Required	Get service records
/api/services	POST	Required	Create service record
/api/services/stats	GET	Required	Get service expense statistics
/api/notifications	GET	Required	Get warranty notifications
/api/notifications/read-all	PUT	Required	Mark notifications as read
/api/documents/:productId/:filename	GET	Required	Securely view a document
💰 ₹0 Cost Approach

This project was developed with a strict ₹0 cost requirement.

The application does not depend on:

Paid APIs
Paid AI APIs
Paid SMS services
Paid cloud storage
Paid subscriptions

Development uses:

React
Node.js
Express
MongoDB
Tailwind CSS
Axios
Lucide React
Local document storage

The deployed version uses free-tier hosting/services where applicable.

🚀 Deployment

The application can be deployed using a free-tier architecture:

                    Internet
                       │
                       ▼
              ┌─────────────────┐
              │ React Frontend  │
              │     Render      │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Node + Express  │
              │     Render      │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ MongoDB Atlas   │
              │  Free Cluster   │
              └─────────────────┘
Deployment Components
Component	Platform
Frontend	Render Static Site
Backend	Render Web Service
Database	MongoDB Atlas
Source Control	GitHub
⚠️ Known Limitation

The current document-management implementation uses local filesystem storage:

backend/uploads/

This approach is suitable for local development and the ₹0 college-project deployment.

However, free web-service environments may use ephemeral filesystems. Therefore, uploaded documents should not be considered permanently durable in the deployed version.

A future production version could replace local storage with a persistent object-storage solution.

⚡ Local Development
Prerequisites

Install:

Node.js
npm
MongoDB

MongoDB should be available locally at:

mongodb://127.0.0.1:27017
1. Clone the Repository
git clone https://github.com/thirumurugan1305/Digital-Warranty-and-Service-Tracker.git

cd Digital-Warranty-and-Service-Tracker
2. Install Dependencies
npm run install:all

If the root installation script is unavailable, install dependencies separately:

cd backend
npm install

cd ../frontend
npm install
3. Configure Backend Environment Variables

Create:

backend/.env

Example:

PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/warranty_tracker
JWT_SECRET=your_secure_random_secret
EXPIRING_SOON_DAYS=30
NODE_ENV=development

Never commit your real .env file or production secrets to GitHub.

4. Start MongoDB

On Windows:

net start MongoDB

Or start MongoDB manually using:

mongod
5. Start the Backend
cd backend
npm run dev

Backend:

http://localhost:5000

Health check:

http://localhost:5000/api/health
6. Start the Frontend

Open another terminal:

cd frontend
npm run dev

Frontend:

http://localhost:5173
🧪 Testing

The project includes backend, integration, security, and database-related tests.

Backend Tests
cd backend
node tests/run_tests.js
Full-Stack Integration Tests
node tests/fullstack_integration_test.js
Live MongoDB Test
node tests/mongo_live_check.js
Frontend Production Build
cd frontend
npm run build
📸 Screenshots

Screenshots of the application will be added here.

Recommended screenshots:

Login page
Registration page
Dashboard
My Products
Product Details
Add Product
Service History
Documents
Notifications
Settings
🔮 Future Enhancements

Possible future improvements include:

Persistent cloud document storage
Email warranty reminders
Mobile application
Advanced analytics
Warranty claim workflow
OCR-based invoice data extraction
Automated invoice information extraction
Exportable warranty reports
Multi-device synchronization
Progressive Web App support
📄 License

This project is licensed under the MIT License.

👨‍💻 Project

Digital Warranty & Product Service Tracker

A full-stack academic project developed using React, Node.js, Express, MongoDB, and modern web technologies.