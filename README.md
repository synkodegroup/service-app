# service-app

Simple monorepo structure:

- `backend/` — REST API (Go + Gin), exposes `/api/v1/healthz`, `Products` CRUD at `/api/v1/products`, and `Users` endpoints
- `frontend-dashboard/` — React + Vite + TypeScript + Tailwind + TanStack Query, `Products` dashboard with CRUD
- `frontend-client/` — React + Vite + TypeScript, skeleton app with health check
- `PRD.md` — product spec and dashboard UI notes

## Prerequisites
- Node.js 18+ and npm
- Go 1.23+

## Backend

Tech stack: Gin, GORM, PostgreSQL (Supabase compatible).

Run the server:

```bash
cd backend
go run ./cmd/api
# Server: http://localhost:8080
```

Environment variables:

- `PORT=8080` — server port
- `CORS_ORIGINS=http://localhost:5173,http://localhost:5174` — allowed origins
- `DATABASE_URL` — Postgres connection string (e.g., Supabase):
  - `postgresql://postgres:<YOUR_PASSWORD>@<YOUR_HOST>:5432/postgres`

Notes:
- On first run, the API auto-migrates the `Product` table and seeds a few dummy records if the table is empty (`backend/cmd/api/main.go:43`).
- Database connection is opened via GORM (`backend/internal/repository/db.go:8`).
- Do not commit secrets; keep `DATABASE_URL` only in your local environment.

Endpoints:

- Health: `GET /api/v1/healthz`
- Products:
  - `GET /api/v1/products`
  - `GET /api/v1/products/:id`
  - `POST /api/v1/products`
  - `PUT /api/v1/products/:id`
  - `DELETE /api/v1/products/:id`
- Users:
  - `GET /api/v1/users`
  - `GET /api/v1/users/:id`
  - `POST /api/v1/users`
  - `PUT /api/v1/users/:id`
  - `DELETE /api/v1/users/:id`

## Frontend Dashboard

Run the dashboard:

```bash
cd frontend-dashboard
npm run dev
# App: http://localhost:5173
```

Environment:

- Create `.env` with `VITE_API_URL=http://localhost:8080`

Features (Products page):
- Table: Name, Price, Stock, Status, Updated At, Actions
- Toolbar: Search, Status filter, Sort, Page size, Create Product
- CRUD: Create/Edit in modal dialogs, Delete with confirmation
- Pagination and sorting synced with local state and API params

## Frontend Client

Run the client app:

```bash
cd frontend-client
npm run dev
# App: http://localhost:5174 (chooses a new port if 5173 is taken)
```

## Development Notes
- CORS defaults allow `http://localhost:5173` and `http://localhost:5174` (`backend/internal/config/config.go:19`).
- Use separate `.env` files locally and never commit them.