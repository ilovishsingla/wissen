# Office Seat Booking System - Backend

Production-ready backend for managing office seat allocations with batch-wise scheduling.

## Features

- **Employee Management**: Create, update, and manage employee records
- **Seat Management**: 50 seats (40 designated + 10 flooder)
- **Smart Booking System**: Batch-aware seat allocation
- **Leave Management**: Employee leave tracking with automatic seat release
- **Holiday Management**: Company holiday management
- **Batch Scheduling**: Automatic batch-wise working day calculation
- **Flooder Seats**: After 3 PM next-day booking for flooder seats

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Joi (Validation)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```

3. **Start MongoDB**
   ```bash
   mongod
   ```

4. **Run server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Employees
- `POST /api/employees` - Create employee
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Deactivate employee

### Seats
- `POST /api/seats/initialize` - Initialize seats
- `POST /api/seats/allocate-designated` - Allocate designated seats
- `GET /api/seats` - Get all seats
- `GET /api/seats/type/:type` - Get seats by type
- `GET /api/seats/available?date=&batch=` - Get available seats
- `GET /api/seats/allocation/weekly?startDate=&batch=` - Weekly allocation

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/date?date=` - Get bookings for specific date
- `GET /api/bookings/employee/:employeeId?startDate=&endDate=` - Employee bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Leaves
- `POST /api/leaves` - Add leave
- `GET /api/leaves` - Get all leaves
- `GET /api/leaves/employee/:employeeId?startDate=&endDate=` - Employee leaves
- `DELETE /api/leaves/:id` - Remove leave

### Holidays
- `POST /api/holidays` - Add holiday
- `GET /api/holidays` - Get all holidays
- `GET /api/holidays/month?month=&year=` - Get holidays for month
- `DELETE /api/holidays/:id` - Remove holiday

## Architecture

