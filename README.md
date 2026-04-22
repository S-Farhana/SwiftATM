# SwiftATM - Banking System

A modern ATM banking system built with Spring Boot and React.

## Tech Stack

**Backend:**
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- H2 Database (in-memory)
- Java 21

**Frontend:**
- React 18
- Vite
- Axios
- CSS Modules

## Features

- 🔐 Secure JWT-based authentication
- 💰 Balance inquiry
- 💸 Cash withdrawal
- 💵 Cash deposit
- 📊 Transaction history
- 💳 Multiple card management
- 🎨 Modern, responsive UI

## Setup & Run

### Prerequisites
- Java 21
- Node.js 18+
- Maven

### Backend Setup

```bash
cd atm-banking
mvn clean spring-boot:run
```

Backend will run on **http://localhost:8081**

### Frontend Setup

```bash
cd atm-banking-ui
npm install
npm run dev
```

Frontend will run on **http://localhost:5173**

## Test Credentials

- **Card Number**: `1234567890123456`
- **PIN**: `1234`

## API Endpoints

- `POST /api/atm/login` - Login with card number and PIN
- `GET /api/atm/balance` - Get account balance
- `POST /api/atm/withdraw` - Withdraw cash
- `POST /api/atm/deposit` - Deposit cash
- `GET /api/atm/transactions` - Get transaction history
- `GET /api/atm/cards` - Get linked cards

## Project Structure

```
atm-banking-project/
├── atm-banking/                    # Spring Boot backend
│   ├── src/main/java/com/atm/banking/
│   │   ├── config/                 # Configuration classes
│   │   ├── controller/             # REST controllers
│   │   ├── dto/                    # Data Transfer Objects
│   │   ├── entity/                 # JPA entities
│   │   ├── repository/             # Data repositories
│   │   ├── security/               # Security & JWT
│   │   └── service/                # Business logic
│   └── src/main/resources/
│       └── application.properties
└── atm-banking-ui/                 # React frontend
    ├── src/
    │   ├── components/             # React components
    │   ├── api.js                  # API client
    │   ├── AuthContext.jsx         # Authentication context
    │   └── App.jsx                 # Main app component
    └── package.json
```

## License

MIT
