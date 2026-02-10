# AI-Powered Fintech Platform

An AI-driven financial intelligence platform designed to transform personal and SME finance. This platform leverages machine learning, predictive analytics, and natural language processing to provide personalized, actionable financial guidance.

## Features

- **Financial Overview**: View accounts, transactions, debts, budgets, and credit score
- **AI Insights**: Get personalized recommendations and risk assessments
- **Financial Twin**: AI-powered behavior profiling and predictions
- **Scenario Simulation**: Test different financial scenarios (spending, debt payoff, investments, emergency fund)
- **AI Chat Companion**: Conversational interface for financial advice
- **Dashboard**: Comprehensive financial dashboard with charts and metrics

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts (for data visualization)
- Lucide React (icons)

### Backend
- Express.js
- JWT Authentication
- bcryptjs (password hashing)
- express-validator (input validation)
- Helmet (security)
- express-rate-limit (rate limiting)
- Winston (logging)
- Morgan (HTTP request logging)
- Compression (response compression)

## Architecture

The backend follows a layered architecture:

1. **Routes**: Define API endpoints and delegate to controllers
2. **Controllers**: Handle HTTP requests/responses and call services
3. **Services**: Contain business logic and data processing
4. **Models**: Define data structures
5. **Utils**: Provide reusable utility functions
6. **Middleware**: Handle cross-cutting concerns (auth, logging, errors)
7. **Config**: Centralized configuration management
8. **Constants**: Define constants and enums

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```
### Running the Application

#### Development Mode (runs both frontend and backend)
```bash
npm run dev
```
The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5005