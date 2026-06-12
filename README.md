# Ethara Inventory OMS

Full-stack Inventory & Order Management System built with React, FastAPI, and PostgreSQL — fully containerized with Docker Compose.

## Stack

- **Frontend:** React 19 + Vite 6
- **Backend:** Python FastAPI
- **Database:** PostgreSQL 16
- **Containerization:** Docker + Docker Compose

## Quick Start

```bash
docker compose up --build
```

The app will be available at `http://localhost`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/products | Create product |
| GET | /api/products | List products |
| GET | /api/products/{id} | Get product |
| PUT | /api/products/{id} | Update product |
| DELETE | /api/products/{id} | Delete product |
| POST | /api/customers | Create customer |
| GET | /api/customers | List customers |
| GET | /api/customers/{id} | Get customer |
| DELETE | /api/customers/{id} | Delete customer |
| POST | /api/orders | Create order |
| GET | /api/orders | List orders |
| GET | /api/orders/{id} | Get order |
| DELETE | /api/orders/{id} | Cancel order |
| GET | /api/dashboard | Dashboard stats |

## Environment Variables

Copy `backend/.env` and adjust:
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `DATABASE_URL` (for Docker, use `postgresql://user:pass@postgres:5432/dbname`)
