# ATM Banking System

A full-stack ATM banking application built with Spring Boot and React, featuring secure authentication, transaction processing, and a modern responsive UI.

## Features

- **Secure Authentication**: JWT-based authentication with BCrypt password hashing
- **Transaction Management**: Withdraw, deposit, and balance inquiry operations
- **Real-time Updates**: Live balance updates and transaction history
- **Multi-card Support**: Support for both debit and credit cards
- **Responsive UI**: Modern, mobile-friendly interface with CSS modules
- **Security Controls**: Daily limits, account status validation, and secure PIN handling
- **Transaction History**: Paginated transaction records with detailed information
- **H2 Console**: Built-in database console for development and debugging

## Tech Stack

### Backend

- **Java 21** - Modern Java features and performance
- **Spring Boot 3.2.5** - Framework for building production-ready applications
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence layer
- **H2 Database** - In-memory database for development
- **JWT (JJWT)** - JSON Web Token implementation
- **Lombok** - Reducing boilerplate code
- **Maven** - Dependency management and build tool

### Frontend

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS Modules** - Scoped styling
- **JavaScript ES6+** - Modern JavaScript features

## Prerequisites

- **Java 17+** (Java 21 recommended)
- **Node.js 16+** and npm
- **Maven 3.6+**

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/atm-banking-system.git
cd atm-banking-system
```

### 2. Backend Setup

```bash
cd atm-banking
mvn spring-boot:run
```

The backend will start on `http://localhost:8081`

### 3. Frontend Setup

```bash
cd atm-banking-ui
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Test Credentials

| Card Number      | PIN  | Account Holder | Balance  |
|------------------|------|----------------|----------|
| 1234567890123456 | 1234 | Arjun Kumar    | Rs.25,000 |
| 9876543210987654 | 5678 | Priya Sharma   | Rs.8,500  |

## Project Structure

```
atm-banking-system/
├── atm-banking/                 # Backend (Spring Boot)
│   ├── src/main/java/
│   │   └── com/atm/banking/
│   │       ├── config/          # Configuration classes
│   │       ├── controller/      # REST controllers
│   │       ├── dto/             # Data Transfer Objects
│   │       ├── entity/          # JPA entities
│   │       ├── repository/      # Data repositories
│   │       ├── security/        # Security configuration
│   │       └── service/         # Business logic
│   └── src/main/resources/
│       └── application.properties
├── atm-banking-ui/              # Frontend (React)
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── api.js               # API client
│   │   ├── AuthContext.jsx      # Authentication context
│   │   └── main.jsx             # Application entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint        | Description         |
|--------|-----------------|---------------------|
| POST   | /api/atm/login  | User authentication |

### Account Operations

| Method | Endpoint               | Description             |
|--------|------------------------|-------------------------|
| GET    | /api/atm/balance       | Get account balance     |
| POST   | /api/atm/withdraw      | Withdraw money          |
| POST   | /api/atm/deposit       | Deposit money           |
| GET    | /api/atm/transactions  | Get transaction history |
| GET    | /api/atm/cards         | Get linked cards        |

## Security Features

- **JWT Authentication**: Stateless authentication with secure tokens
- **Password Hashing**: BCrypt for secure password storage
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: Comprehensive validation for all inputs
- **Transaction Limits**: Daily withdrawal and deposit limits
- **Account Status**: Active/blocked/closed account validation
