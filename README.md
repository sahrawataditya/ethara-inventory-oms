# Ethara Inventory OMS

Full-stack **Inventory & Order Management System** with React frontend, FastAPI backend, and PostgreSQL database.

## Tech Stack

- **Frontend:** React 19 + Vite 6 + Axios
- **Backend:** Python FastAPI + SQLAlchemy 2.0
- **Database:** PostgreSQL 16
- **Containerization:** Docker + Docker Compose

## Quick Start

### Option 1: Docker Compose (recommended)

```bash
# 1. Clone the repo
git clone https://github.com/sahrawataditya/ethara-inventory-oms.git
cd ethara-inventory-oms

# 2. Set your database password in backend/.env
#    (or use the defaults for local dev)

# 3. Start everything
docker compose up --build
```

### Option 2: Docker Hub single image

```bash
docker run -d \
  --name ethara-oms \
  -p 80:80 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require" \
  -e CORS_ORIGINS="*" \
  persues008/ethara-inventory-oms:latest
```

The app runs at **http://localhost** (both frontend and backend served from port 80).

### Option 3: Local development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m app.seed        # creates tables + seed data
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Docker Hub Image

**Single unified image** containing both frontend and backend:

```
docker pull persues008/ethara-inventory-oms:latest
```

The image uses **supervisord** to run:
- **Backend** — FastAPI (uvicorn) on port 8000
- **Frontend** — Nginx serving React SPA on port 80 (proxies /api to backend)
- **Seed** — Auto-runs on first start to populate the database

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `CORS_ORIGINS` | No | `*` | Allowed CORS origins |

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| **Products** | | | |
| POST | `/api/products` | Create a product | — |
| GET | `/api/products` | List all products | — |
| GET | `/api/products/{id}` | Get product by ID | — |
| PUT | `/api/products/{id}` | Update a product | — |
| DELETE | `/api/products/{id}` | Delete a product | — |
| **Customers** | | | |
| POST | `/api/customers` | Create a customer | — |
| GET | `/api/customers` | List all customers | — |
| GET | `/api/customers/{id}` | Get customer by ID | — |
| DELETE | `/api/customers/{id}` | Delete a customer | — |
| **Orders** | | | |
| POST | `/api/orders` | Create an order (auto-calculates total, reduces stock) | — |
| GET | `/api/orders` | List all orders | — |
| GET | `/api/orders/{id}` | Get order details with items | — |
| DELETE | `/api/orders/{id}` | Cancel an order | — |
| **Dashboard** | | | |
| GET | `/api/dashboard` | Summary stats + low stock alerts | — |

## Business Logic

- **SKU** and **email** fields enforce uniqueness
- Product **quantity cannot be negative**
- Orders fail if **inventory is insufficient**
- Creating an order **auto-reduces stock**
- **Total amount** is calculated automatically by the backend
- All APIs return proper **HTTP status codes** and **error messages**

## Project Structure

```
ethara-inventory-oms/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry point
│   │   ├── config.py         # Environment config
│   │   ├── database.py       # SQLAlchemy engine
│   │   ├── models/           # DB models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── routers/          # API routes
│   │   └── seed.py           # Seed script
│   ├── Dockerfile            # Standalone backend image
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   └── services/api.js   # Axios API client
│   ├── Dockerfile            # Standalone frontend image
│   └── vercel.json           # Vercel deployment config
├── Dockerfile                # Unified image (both apps)
├── docker-compose.yml        # Full stack orchestration
├── nginx.conf                # Nginx config for unified image
└── supervisord.conf          # Process manager config
```

## Deployment

### Backend (Render)
Connected to the GitHub repo — auto-deploys from `backend/` directory.
https://ethara-inventory-backend-le4p.onrender.com

### Frontend (Vercel)
https://ethara-inventory-two.vercel.app
