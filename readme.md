# 🚗 Vehicle Rental System (Backend)

A modular backend API for managing vehicle rentals with authentication, vehicle management, user management, and booking features.

## 🛠 Tech Stack
- Node.js + TypeScript  
- Express.js  
- PostgreSQL  
- bcrypt, JWT  

## 📂 Project Structure
src/
├── modules/
│ ├── auth/
│ ├── users/
│ ├── vehicles/
│ └── bookings/
├── middlewares/
├── config/
├── app.ts
└── server.ts

## 🗄 Database Tables
**Users:** id, name, email, password, phone, role  
**Vehicles:** id, vehicle_name, type, registration_number, daily_rent_price, availability_status  
**Bookings:** id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status  

## 🔐 Authentication
- bcrypt for hashing  
- JWT for login  
- Role-based access (Admin, Customer)

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Desc |
|--------|----------|------|
| POST | /api/v1/auth/signup | Register |
| POST | /api/v1/auth/signin | Login |

### Vehicles
| Method | Endpoint 
|--------|----------
| POST | /api/v1/vehicles 
| GET | /api/v1/vehicles 
| GET | /api/v1/vehicles/:id 
| PUT | /api/v1/vehicles/:id 
| DELETE | /api/v1/vehicles/:id

### Users
| Method | Endpoint | 
|--------|----------|
| GET | /api/v1/users 
| PUT | /api/v1/users/:id
| DELETE | /api/v1/users/:id

### Bookings
| Method | Endpoint |
|--------|----------|
| POST | /api/v1/bookings
| GET | /api/v1/bookings
| PUT | /api/v1/bookings/:id

## ▶️ Run Project
```bash
npm install
npm run dev
