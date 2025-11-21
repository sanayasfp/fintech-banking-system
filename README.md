# Fintech Banking System

## Table of Contents

- [Fintech Banking System](#fintech-banking-system)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
    - [Core Banking Operations](#core-banking-operations)
    - [Business Rules](#business-rules)
    - [REST API](#rest-api)
  - [Technical Stack](#technical-stack)
  - [Project Architecture](#project-architecture)
    - [Layer Responsibilities](#layer-responsibilities)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Presentation Layers](#presentation-layers)
    - [Starting the REST API Server](#starting-the-rest-api-server)
    - [Running the Prototype](#running-the-prototype)
    - [Running Tests](#running-tests)
    - [Building for Production](#building-for-production)
    - [Example Usage](#example-usage)
    - [Statement Output Example](#statement-output-example)
  - [Testing](#testing)
  - [Design Decisions](#design-decisions)
    - [Architecture](#architecture)
    - [Key Design Choices](#key-design-choices)
    - [Error Handling](#error-handling)
  - [API Documentation](#api-documentation)
    - [Available Endpoints](#available-endpoints)
      - [Authentication](#authentication)
      - [Account Management](#account-management)
      - [Transactions](#transactions)
      - [Statements](#statements)
      - [Health Check](#health-check)
    - [Authentication](#authentication-1)
    - [Example API Requests](#example-api-requests)
  - [Development](#development)
    - [Code Quality Tools](#code-quality-tools)
    - [Available Scripts](#available-scripts)
    - [Project Structure](#project-structure)
  - [Future Improvements](#future-improvements)
    - [Completed](#completed)
    - [Planned](#planned)

## Overview

A banking system implementation that provides basic account management operations including deposits, withdrawals, and transaction statements. The system enforces business rules to maintain data integrity and financial accuracy.

## Features

### Core Banking Operations
- Deposit funds to an account
- Withdraw funds from an account
- Print account statement with transaction history
- View account balance
- List all accounts with pagination
- Close/delete accounts

### Business Rules
- Validates transaction amounts (positive values only)
- Prevents overdraft (no negative balances)
- Maintains transaction history with dates and balances
- High-precision decimal calculations for financial operations
- Immutable transaction records

### REST API
- RESTful API with Fastify framework
- JWT authentication and authorization
- OpenAPI/Swagger documentation
- Request validation with TypeBox schemas
- Rate limiting and security headers
- Cursor-based pagination
- Structured error responses

## Technical Stack

**Backend & API:**
- **Language**: TypeScript 5.9.3
- **Runtime**: Node.js v24.6.0
- **Web Framework**: Fastify 5.2.0
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: TypeBox with Ajv
- **API Docs**: Swagger/OpenAPI (@fastify/swagger)

**Data & Storage:**
- **ORM**: Prisma 6.4.1
- **Database**: PostgreSQL
- **Financial Math**: Decimal.js 10.5.0 (high-precision arithmetic)

**Security:**
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: @fastify/rate-limit

**Development Tools:**
- **Testing**: Jest 30.2.0 with ts-jest
- **Linting**: ESLint 9.39.1 with TypeScript support
- **Formatting**: Prettier 3.6.2
- **Build**: TypeScript compiler (tsc)
- **Dev Tools**: ts-node, nodemon
- **DI Container**: Awilix

## Project Architecture

The project follows a **Domain-Driven Design (DDD)** architecture with clear separation of concerns:

```
src/
├── domain/                 # Business logic and rules
│   ├── entities/          # Core business objects (BankAccount, User)
│   ├── value-objects/     # Immutable value types (Money, Transaction)
│   ├── repositories/      # Repository interfaces
│   ├── services/          # Domain services
│   └── errors/            # Domain-specific errors
├── application/           # Use cases and application logic
│   ├── services/         # Application services (AccountService, AuthService)
│   ├── queries/          # Query interfaces and pagination
│   └── errors/           # Application errors
├── infrastructure/        # External concerns
│   ├── persistence/      # Prisma repositories (DB implementations)
│   ├── providers/        # External service providers (SystemClock)
│   └── errors/           # Infrastructure errors
└── presentation/         # User interface layer
    ├── printers/         # Console output formatters
    ├── web/             # REST API (Fastify)
    │   ├── controllers/ # HTTP request handlers
    │   ├── routes/      # API route definitions
    │   ├── schemas/     # Request/response validation schemas
    │   ├── middleware/  # Auth, error handling
    │   ├── config/      # Environment and logger config
    │   └── core/        # DI container, Prisma client
    └── server.ts        # Application entry point
```

### Layer Responsibilities

- **Domain**: Contains the core business logic, isolated from external dependencies
- **Application**: Orchestrates domain objects to fulfill use cases
- **Infrastructure**: Implements technical details (database, external providers)
- **Presentation**: Exposes the application through REST API and console interface

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd fintech-banking-system

# Install dependencies
npm install

# Setup database (optional for web presentation)
npx prisma generate
npx prisma migrate dev
```

## Usage

### Presentation Layers

The application provides two presentation interfaces:

1. **Console Prototype** - Simple demonstration using in-memory repository
2. **Web API** - Full REST API with database persistence

### Starting the REST API Server

```bash
# Development mode with auto-reload
npm run dev

# The server will start on http://localhost:3000
# API Documentation available at http://localhost:3000/docs
```

### Running the Prototype

```bash
# Run the console prototype demonstration
npm run prototype
```

This will execute a demonstration of the banking system with console output showing deposits, withdrawals, statement printing, and error handling.

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
node dist/presentation/server.js
```

### Example Usage

```typescript
import { BankAccountPrototype } from './domain/entities/BankAccountPrototype';
import { InMemoryAccountRepository } from './domain/repositories/InMemoryAccountRepository';
import { SystemClock } from './infrastructure/providers/SystemClock';
import { ConsoleStatementPrinter } from './presentation/printers/ConsoleStatementPrinter';
import { Money } from './domain/value-objects/Money';

// Create account instance
const repository = new InMemoryAccountRepository();
const clock = new SystemClock();
const printer = new ConsoleStatementPrinter();
const account = new BankAccountPrototype(repository, clock, printer);

// Perform operations
account.deposit(Money.from(1000));
account.withdraw(Money.from(500));
account.printStatement();
```

### Statement Output Example

```
Date       | Amount    | Balance
2024-01-14 | -500.00   | 500.00
2024-01-13 | 1000.00   | 1000.00
```

## Testing

The project includes comprehensive test coverage with 24 test cases covering:

- Standard operations (deposit, withdraw, statement)
- Input validation (zero/negative amounts)
- Business rules (overdraft prevention)
- Edge cases (large amounts, decimals, same-date transactions)
- Data integrity (immutability, traceability)

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Design Decisions

### Architecture
The project uses a **layered architecture** pattern with clear separation:
- **Domain Layer**: Business logic and entities
- **Application Layer**: Use cases and services
- **Infrastructure Layer**: External dependencies
- **Presentation Layer**: User interface

### Key Design Choices

1. **Money Value Object**: Uses Decimal.js to avoid floating-point precision issues in financial calculations
2. **Immutable Transactions**: Transaction objects are frozen to prevent accidental modifications
3. **Dependency Injection**: Components receive dependencies through constructors for testability
4. **Repository Pattern**: Abstracts data storage from business logic
5. **Clock Abstraction**: Time operations are injectable for deterministic testing

### Error Handling

Custom domain errors are used for explicit business rule violations:
- `InvalidAmountError`: Thrown for zero or negative transaction amounts
- `InsufficientFundsError`: Thrown when withdrawal exceeds available balance
- `UnauthorizedError`: Thrown for authentication/authorization failures
- `DuplicateAccountNumberError`: Thrown when account number already exists

## API Documentation

The REST API is fully documented with OpenAPI/Swagger.

**Access the interactive API documentation:**
- **Swagger UI**: http://localhost:3000/docs

### Available Endpoints

#### Authentication
```
POST   /api/v1/auth/register    # Register new user
POST   /api/v1/auth/login       # Login and get JWT token
```

#### Account Management
```
POST   /api/v1/accounts              # Create new account
GET    /api/v1/accounts              # List all accounts (paginated)
GET    /api/v1/accounts/:id/balance  # Get account balance
DELETE /api/v1/accounts/:id          # Close account
```

#### Transactions
```
POST   /api/v1/accounts/:id/deposit   # Deposit funds
POST   /api/v1/accounts/:id/withdraw  # Withdraw funds
```

#### Statements
```
GET    /api/v1/accounts/:id/statement        # Get account statement
POST   /api/v1/accounts/:id/statement/print  # Print statement
GET    /api/v1/accounts/:id/statement/export # Export statement
```

#### Health Check
```
GET    /health                      # Server health status
```

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Example API Requests

**Create Account:**
```bash
curl -X POST http://localhost:3000/api/v1/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "userId": "01JBCD9EF0GH1JKLM2NOPQRST",
    "accountNumber": "1234567890",
    "initialBalance": 1000
  }'
```

**Deposit Funds:**
```bash
curl -X POST http://localhost:3000/api/v1/accounts/:id/deposit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"amount": 500}'
```

**Get Statement:**
```bash
curl -X GET http://localhost:3000/api/v1/accounts/:id/statement \
  -H "Authorization: Bearer <token>"
```

## Development

### Code Quality Tools

The project uses several tools to maintain code quality:

- **ESLint**: Configured with TypeScript recommended rules
- **Prettier**: Code formatting with consistent style
- **TypeScript**: Strict mode enabled for type safety

### Available Scripts

```bash
npm run build         # Compile TypeScript to JavaScript
npm run dev           # Run REST API server with auto-reload
npm run prototype     # Run console prototype demonstration
npm test              # Run test suite
npm test:watch        # Run tests in watch mode
npm test:coverage     # Run tests with coverage report
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
npm run typecheck     # Type-check without emitting files
```

### Project Structure

```
src/
├── domain/                    # Core business logic
│   ├── entities/             # Business entities (BankAccount, User)
│   ├── value-objects/        # Immutable values (Money, Transaction, Statement)
│   ├── repositories/         # Data access interfaces
│   ├── services/             # Domain services (IClock, IAuthorizationService)
│   └── errors/               # Domain-specific errors
├── application/              # Application use cases
│   ├── services/            # Application services (AccountService, AuthService)
│   ├── queries/             # Query interfaces and pagination
│   └── errors/              # Application errors
├── infrastructure/           # Technical implementations
│   ├── persistence/         # Prisma repositories (PrismaAccountRepository)
│   ├── providers/           # External providers (SystemClock)
│   └── errors/              # Infrastructure errors
├── presentation/            # User interface layer
│   ├── printers/           # Output formatters (ConsoleStatementPrinter)
│   ├── prototype.ts        # Console demonstration script
│   ├── server.ts           # REST API entry point
│   └── web/                # REST API with Fastify
│       ├── controllers/   # HTTP request handlers
│       ├── routes/        # API route definitions
│       ├── schemas/       # TypeBox validation schemas
│       ├── middleware/    # Authentication, error handling
│       ├── config/        # Environment, logger configuration
│       ├── core/          # DI container, Prisma client
│       ├── types/         # TypeScript type definitions
│       └── utils/         # Helper functions
├── __tests__/              # Test files
└── prisma/                # Database schema and migrations
```

## Future Improvements

### Completed
- REST API with Fastify
- Persistent storage with Prisma
- API documentation (Swagger/OpenAPI)
- Authentication and authorization (JWT)
- Multi-account support
- Rate limiting and security

### Planned
- Web frontend (React/Vue/Angular)
- Docker containerization
- CI/CD pipeline (GitHub Actions)
- Integration and E2E tests
- Mobile application (React Native/Flutter)
- Transaction filtering and search
- Account statements export (PDF)
- Notifications system
- Audit logs
- Multi-currency support
