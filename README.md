# service-app

Struktur monorepo sederhana:

- `backend/` — API REST (Go + Gin), menyediakan `/healthz` dan CRUD `Product` di `/api/v1/products`
- `frontend-dashboard/` — React + Vite + TypeScript + Tailwind + TanStack Query, halaman dashboard `Products` dengan CRUD
- `frontend-client/` — React + Vite + TypeScript, skeleton dengan health check
- `PRD.md` — spesifikasi produk dan UI dashboard

## Prasyarat
- Node.js 18+ dan npm
- Go 1.22+

## Menjalankan Backend

```bash
cd backend
go run ./cmd/api
# Server: http://localhost:8080
```

Environment (opsional):

- `PORT=8080`
- `CORS_ORIGINS=http://localhost:5173,http://localhost:5174`

## Menjalankan Frontend Dashboard

```bash
cd frontend-dashboard
npm run dev
# App: http://localhost:5173
```

Konfigurasi env:

- Buat file `.env` dan set `VITE_API_URL=http://localhost:8080`

## Menjalankan Frontend Client

```bash
cd frontend-client
npm run dev
# App: http://localhost:5174 (otomatis memilih port jika 5173 terpakai)
```

## Fitur Dashboard (Products)
- Tabel list: kolom Name, Price, Stock, Status, Updated At, Actions
- Toolbar: Search, Status filter, Sort, Page size, Create Product
- CRUD: Create/Edit via modal, Delete dengan konfirmasi
- Pagination dan sorting sinkron dengan state lokal

## Catatan
- Data `Product` disimpan in-memory di backend (untuk init). Integrasi DB bisa ditambahkan kemudian.
- Jangan commit file `.env`. Gunakan `.env` lokal dengan `VITE_API_URL` untuk koneksi API.