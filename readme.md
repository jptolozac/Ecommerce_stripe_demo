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

    The project is an [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) monorepo: `backend` and `frontend` share a single `node_modules` folder and a single `package-lock.json` at the repository root. Run the install once, from the root:

    ```bash
    npm install
    ```

    To add a dependency to one of the packages, run it from the root with `--workspace`:

    ```bash
    npm install <package> --workspace=backend
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
    VITE_BACKEND_URL
    ```

## Usage

### Running the Backend

To start the backend server, run from the repository root:

```bash
npm run dev:backend
```

### Running the frontend

To start the frontend, run from the repository root:

```bash
npm run dev:frontend
```

Other root scripts: `npm run build`, `npm run lint` and `npm run preview` (all for the frontend).