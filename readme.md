# Bookstore Application

Welcome to the Bookstore Application! This project is a full-fledged e-commerce application for selling books, featuring a shopping cart, user authentication, and Stripe integration for handling payments.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

## Installation

To get started with the project, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/jptolozac/Ecommerce_stripe_demo.git
    cd Ecommerce_stripe_demo
    ```

2. **Install dependencies for both the backend and the frontend:**

    ```bash
    cd backend
    npm install
    cd ../frontend
    npm install
    ```

## Configuration

### Backend

1. Create a `.env` file in the `backend` directory with the following environment variables:

    ```env
    PORT
    HOST
    MYSQL_HOST
    MYSQL_PORT
    MYSQL_USER
    MYSQL_PASSWORD
    MYSQL_DB
    JWT_SECRET
    STRIPE_SECRET
    ```

2. Ensure you have a MYSQL instance running and update the connection string in your backend configuration if necessary.

### Frontend

1. Create a `.env` file in the `frontend` directory with the following environment variables:

    ```env
    REACT_APP_BACKEND_URL=https://your-backend-domain.com
    ```

## Usage

### Running the Backend

To start the backend server, navigate to the `backend` directory and run:

```bash
npm run dev
```

### Running the frontend

To start the backend server, navigate to the `frontend` directory and run:

```bash
npm run dev
```