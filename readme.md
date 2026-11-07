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

    The project is a [pnpm workspace](https://pnpm.io/workspaces) monorepo (requires Node.js 20.19+ or 22.12+ and [pnpm](https://pnpm.io/installation) 10): `backend` and `frontend` share a single `pnpm-lock.yaml` and a single package store in the root `node_modules`. Run the install once, from the root:

    ```bash
    pnpm install
    ```

    To add a dependency to one of the packages, run it from the root with `--filter`:

    ```bash
    pnpm add <package> --filter backend
    ```

## Configuration

### Backend

1. Copy `backend/.env-example` to `backend/.env` and fill in the values:

    ```bash
    cp backend/.env-example backend/.env
    ```

    | Variable | Description |
    | --- | --- |
    | `PORT`, `HOST`, `PROTOCOL` | Where the API listens; also used to build the Stripe success/cancel URLs |
    | `FRONTEND_URL` | Frontend URL that Stripe payment redirects return to |
    | `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` | MySQL connection |
    | `JWT_SECRET` | Secret used to sign JWT tokens |
    | `STRIPE_SECRET` | Stripe secret key (use a `sk_test_...` key for development) |

2. Ensure you have a MySQL instance running. The schema and seed data are in `backend/data`.

### Frontend

1. Copy `frontend/.env-example` to `frontend/.env` and set `VITE_BACKEND_URL` to the backend API base URL, including the `/api` prefix (e.g. `http://localhost:3000/api`):

    ```bash
    cp frontend/.env-example frontend/.env
    ```

## Usage

### Running the Backend

To start the backend server, run from the repository root:

```bash
pnpm dev:backend
```

### Running the frontend

To start the frontend, run from the repository root:

```bash
pnpm dev:frontend
```

Other root scripts: `pnpm build`, `pnpm lint` and `pnpm preview` (all for the frontend), and `pnpm test` to run the backend unit tests (Jest, no database or Stripe key needed; `pnpm --filter backend test:coverage` for coverage).