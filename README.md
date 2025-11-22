<div align="center">

# service-app

Monorepo for a modern commerce admin dashboard and REST API.

</div>

**Contents**
- `backend/` — Go + Gin REST API (Products & Users)
- `frontend-dashboard/` — React + Vite + TypeScript + Tailwind + TanStack Query
- `frontend-client/` — React + Vite starter with health check

---

## 1. Project Overview

- Purpose: Provide a simple yet production-ready foundation for managing products and users, with a clean REST API and a responsive admin dashboard.
- Key Features:
  - REST API with `Products` CRUD and `Users` endpoints
  - PostgreSQL via GORM (Supabase-compatible, PgBouncer-friendly)
  - CORS and basic auth header validation middleware
  - Dashboard with search, pagination, create/edit/delete products
  - TanStack Query for cache, mutations, and smoother UX

Benefits
- Clear layered architecture (handler → service → repository → database)
- Fast local development with Vite and Tailwind
- Works with hosted PostgreSQL including Supabase

---

## 2. System Requirements

- Hardware
  - Minimum: 2 CPU cores, 4GB RAM, 500MB free disk
  - Recommended: 4+ CPU cores, 8GB RAM, SSD
- Operating Systems
  - macOS, Linux, Windows (WSL2 recommended on Windows)
- Software Dependencies (exact versions)
  - Go `1.23+` (toolchain `go1.24.10`) — `backend/go.mod:1–5`
  - Gin `v1.10.0` — `backend/go.mod:7–12`
  - gorm `v1.31.1`, gorm/driver/postgres `v1.6.0` — `backend/go.mod:7–12`
  - Node.js `18+` or Bun `1.2+` for frontends
  - Vite `^5.4.8`, TypeScript `5.5.4` — `frontend-dashboard/package.json:70–80`
  - TanStack React Query `^5.59.16` — `frontend-dashboard/package.json:14–64`
- Environment Setup
  - Backend reads environment via `.env` (optional) — `backend/internal/config/config.go:17–25`
  - Frontend dashboard reads `.env` for API base URL (`VITE_API_URL`)

---

## 3. Installation Guide

### Clone the repository
```bash
git clone https://github.com/your-org/service-app.git
cd service-app
```

### Backend setup
```bash
cd backend
go mod download
```

Create `.env` (or export directly):
```bash
# backend/.env
PORT=8080
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
# Supabase pooler example (PgBouncer-compatible)
DATABASE_URL="postgresql://postgres:<PASSWORD>@<HOST>:6543/postgres?pgbouncer=true&sslmode=require"
# Optional: Direct (session) connection
DIRECT_URL="postgresql://postgres:<PASSWORD>@<HOST>:5432/postgres?sslmode=require"
```

Initialize database (manual SQL)
```sql
-- Users table (provided in migrations)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  stock INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active','inactive')),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

> Note: GORM connection is configured for PgBouncer compatibility (`PreferSimpleProtocol` and `PrepareStmt=false`) — `backend/internal/repository/db.go:8–14`.

### Frontend dashboard setup
```bash
cd frontend-dashboard
# using Bun
bun install
# or using npm
npm install
```

Create `.env`:
```bash
# frontend-dashboard/.env
VITE_API_URL=http://localhost:8080
```

### Frontend client setup (optional)
```bash
cd frontend-client
npm install
```

---

## 4. Usage Instructions

### Launch the backend
```bash
cd backend
go run ./cmd/api
# Backend: http://localhost:8080
```

Environment defaults
- `PORT=8080`, `CORS_ORIGINS=http://localhost:5173,http://localhost:5174` — `backend/internal/config/config.go:20–22`
- Uses `DATABASE_URL` or falls back to `DIRECT_URL` — `backend/cmd/api/main.go:27–33`

### Launch the dashboard
```bash
cd frontend-dashboard
# with Bun
bun run dev
# with npm
npm run dev
# Dashboard: http://localhost:5173
```

### Basic operations
- Products list, search, paginate
- Create/Edit via modal dialogs; Delete with confirmation
- Changes are reflected immediately thanks to TanStack Query invalidation

### Common API use cases (curl examples)
```bash
# list products
curl -s "http://localhost:8080/api/v1/products?page=1&page_size=10"

# create product
curl -s -X POST "http://localhost:8080/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop Stand","price":45.5,"stock":20,"status":"active"}'

# update product
curl -s -X PUT "http://localhost:8080/api/v1/products/<id>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop Stand Pro","price":49.9,"stock":25,"status":"active"}'

# delete product
curl -s -X DELETE "http://localhost:8080/api/v1/products/<id>"

# users
curl -s "http://localhost:8080/api/v1/users"
```

---

## 5. Technical Specifications

### Architecture Overview
- Request flow:
  - `route` registers API endpoints and applies middleware — `backend/internal/route/route.go:9–12`
  - `handler` receives HTTP requests (Gin), validates inputs, returns responses — `backend/internal/handler/product_handler.go:1–13`
  - `service` contains business logic and validation — `backend/internal/service/product_service.go:1–17`
  - `repository` abstracts data access (GORM) — `backend/internal/repository/gorm_product_repository.go:1–12`
  - `model` defines data structures — `backend/internal/model/product.go:1–20`

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   route      │ ─▶  │   handler    │ ─▶  │   service    │ ─▶  │  repository  │ ─▶ DB
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
        ▲                         │                  │                  
        │                         ▼                  ▼                  
     middleware             response JSON        validation           GORM
```

### Key Backend Files
- Server bootstrap: `backend/cmd/api/main.go:21–66`
- Config loader: `backend/internal/config/config.go:17–25`
- DB open (PgBouncer‑safe): `backend/internal/repository/db.go:8–14`
- Routes: `backend/internal/route/route.go:1–36`
- Middleware (auth header format): `backend/internal/middleware/auth.go:9–22`
- Product stack:
  - Handler: `backend/internal/handler/product_handler.go:10–13`
  - Service: `backend/internal/service/product_service.go:14–17`
  - Repository (GORM): `backend/internal/repository/gorm_product_repository.go:1–12`
  - Interface: `backend/internal/repository/product_repository.go:1–12`
  - Model: `backend/internal/model/product.go:1–20`
- Users stack mirrors the same pattern.

### Frontend Dashboard
- Entry + provider: `frontend-dashboard/src/main.tsx:1–10`
- App shell + layout: `frontend-dashboard/src/App.tsx:10–35`, `src/components/DashboardLayout.tsx:14–84`
- Products page (TanStack Query): `frontend-dashboard/src/pages/Products.tsx:69–110,120–140,150–168`
- UI toolkit: shadcn/ui components under `src/components/ui/*`

---

## Troubleshooting
- Bun + Vite: If dev server fails with an esbuild error, install `esbuild` directly:
  ```bash
  bun add esbuild
  bun run dev
  ```
- Supabase pooler: Ensure `DATABASE_URL` uses port `6543` with `pgbouncer=true`.
- CORS: Update `CORS_ORIGINS` to match your frontend URLs.

---

## Security & Best Practices
- Never commit secrets; keep `.env` local. `backend/.gitignore` ignores `.env`.
- Use HTTPS for hosted deployments; set `sslmode=require` for PostgreSQL.
- Validate inputs at the service layer; handlers return clear error codes.

---

## License
MIT (or your organization’s policy).