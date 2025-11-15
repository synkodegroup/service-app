# PRD: Inisialisasi Monorepo dan Detail Tampilan Dashboard (CRUD)

## Tujuan
- Menyediakan dokumen spesifikasi produk untuk inisialisasi proyek dan detail tampilan dashboard dengan satu fitur CRUD penuh.
- Fokus pada struktur direktori root yang sederhana dan pengalaman pengembang yang bersih.

## Ruang Lingkup
- Inisialisasi proyek dengan struktur root:
  - `backend/`
  - `frontend-dashboard/`
  - `frontend-client/`
  - `README.md`
- Detail UI/UX dashboard untuk fitur CRUD entitas `Product` yang terhubung ke API backend.
- Backend detail hanya sebatas ekspektasi endpoint yang diperlukan UI (tanpa implementasi teknis).

## Teknologi
- Backend: Golang + Gin (API REST).
- Frontend dashboard: React + Vite + TypeScript + TailwindCSS + TanStack Query.
- Frontend client: React + Vite + TypeScript (skeleton, tidak dalam ruang lingkup detail UI).

## Inisialisasi (High-level)
- Buat folder root dengan tiga modul: `backend/`, `frontend-dashboard/`, `frontend-client/`, dan `README.md` di root.
- Frontend dashboard: aktifkan Tailwind, pasang TanStack Query, dan siapkan `.env` dengan `VITE_API_URL` mengarah ke backend.
- Frontend client: scaffold dasar, menampilkan halaman sederhana dan siap dikembangkan kemudian.
- Backend: sediakan endpoint REST untuk entitas `Product` dan `GET /healthz`.

## Best Practice Awal
- Struktur root sederhana sesuai permintaan, tanpa workspace kompleks.
- Penamaan konsisten: folder kebab-case, komponen PascalCase, file utilitas kebab-case.
- TypeScript strict di frontend; gunakan `eslint` + `prettier` untuk gaya kode konsisten.
- Manajemen environment: `.env` tidak dikomit; sediakan `.env.example` di `README.md`.
- API versioning (`/api/v1`), format error terstandar, dan endpoint `GET /healthz` untuk monitoring.
- CORS whitelist dari env (minimal `http://localhost:5173` untuk dashboard, `http://localhost:5174` untuk client).
- Logging ringkas (level info), hindari mencetak payload sensitif; gunakan correlation/request ID jika diperlukan.
- Testing minimal: FE (render dan validasi form), BE (service validasi dan handler dasar).
- CI sederhana: jalankan lint dan test untuk FE/BE pada push PR (opsional, tidak wajib saat init).

## Checklist Inisialisasi
- Backend
  - Inisialisasi module Go (`go mod init`).
  - Pasang dependency: `gin-gonic/gin`, `gin-contrib/cors`.
  - Definisikan router: `GET /healthz`, grup `/api/v1/products` untuk CRUD.
  - Tambahkan middleware: `Recovery`, `CORS`, logging sederhana.
  - Konfigurasi port via env (default `8080`), cetak URL saat start.
- Frontend Dashboard
  - Scaffold Vite React TypeScript.
  - Pasang Tailwind (`tailwind.config`, `postcss.config`, `index.css`).
  - Pasang TanStack Query; bungkus app dengan `QueryClientProvider`.
  - Buat halaman `Products` dan komponen utilitas: `Table`, `Pagination`, `Modal`, `Input`, `Select`, `Button`.
  - Siapkan `src/lib/api.ts` untuk wrapper HTTP dengan `VITE_API_URL`.
- Frontend Client
  - Scaffold Vite React TypeScript.
  - Siapkan `QueryClientProvider` dan satu halaman `Home` sederhana.
  - Lakukan call `GET /healthz` untuk uji koneksi.

## Entitas: Product
- Fields:
  - `id: string` (UUID v4)
  - `name: string` (3–100 karakter, unik case-insensitive)
  - `price: number` (> 0, dua desimal)
  - `stock: number` (integer ≥ 0)
  - `status: "active" | "inactive"`
  - `created_at: string` (ISO8601)
  - `updated_at: string` (ISO8601)

## Kontrak API (Ekspektasi UI)
- Base URL: `VITE_API_URL` (contoh `http://localhost:8080`).
- `GET /healthz` → `{ status: "ok" }`.
- `GET /api/v1/products` (server-side list):
  - Query: `page`, `page_size`, `search`, `status`, `sort_by`, `sort_dir`.
  - Response: `{ data: Product[], pagination: { page, page_size, total_items, total_pages } }`.
- `GET /api/v1/products/:id` → `Product`.
- `POST /api/v1/products` → create `Product` dari `{ name, price, stock, status }`.
- `PUT /api/v1/products/:id` → update penuh `Product`.
- `DELETE /api/v1/products/:id` → `{ deleted: true }`.
- Error format diharapkan: `{ error: { code, message, details? } }`.

## Frontend Dashboard: Halaman & Navigasi
- Halaman utama: `Products`.
- URL contoh: `/products` dengan state (query params) tersinkron untuk `page`, `page_size`, `search`, `status`, `sort_by`, `sort_dir`.
- Tidak perlu routing kompleks; cukup satu halaman dengan modal untuk create/edit.

## Komponen UI
- Topbar/Toolbar:
  - Judul: "Products".
  - `Search` input (debounce 300 ms) untuk `name`.
  - `Status` filter dropdown: `All | Active | Inactive`.
  - `Sort` select: `Name | Price | Stock | Updated` + arah `Asc/Desc`.
  - `Page size` select: `10 | 20 | 50`.
  - Tombol `Create Product`.
- Tabel:
  - Kolom: `Name`, `Price`, `Stock`, `Status`, `Updated At`, `Actions`.
  - Baris aksi: `Edit`, `Delete`.
  - Loading state: skeleton rows.
  - Empty state: teks dan tombol `Create Product`.
- Pagination:
  - `Prev`, `Next`, dan indikator halaman saat ini.
- Modal `ProductForm`:
  - Fields: `name`, `price`, `stock`, `status`.
  - Validasi di client: sama dengan aturan model.
  - Tombol: `Save` (enabled hanya saat valid), `Cancel`.
  - Mode: `Create` dan `Edit` (prefill data saat edit).
- Dialog Konfirmasi Delete:
  - Teks konfirmasi, tombol `Delete` (destructive), `Cancel`.

## Perilaku & Interaksi
- List:
  - Memuat data dari API dengan TanStack Query menggunakan key `products` dan parameter.
  - Search dan filter mengubah query params dan memicu refetch.
  - Sort dan pagination tersinkron ke URL dan memicu refetch.
- Create:
  - Buka modal form kosong; submit POST.
  - Setelah sukses: tutup modal, reset form, invalidasi query list.
- Edit:
  - Buka modal dengan data baris; submit PUT.
  - Setelah sukses: tutup modal dan invalidasi list/detail.
- Delete:
  - Tampilkan dialog konfirmasi; submit DELETE.
  - Setelah sukses: invalidasi list; boleh gunakan optimistic update (opsional).

## State & Data (TanStack Query)
- Query keys:
  - `['products', { page, page_size, search, status, sort_by, sort_dir }]`.
  - `['product', id]` untuk prefetch saat edit.
- Pengaturan:
  - `staleTime`: 5–10 detik, `retry`: 1.
  - Global error handler sederhana (mis. toast/alert).

## Akses API
- `frontend-dashboard/src/lib/api.ts`:
  - Wrapper `fetch`: base URL dari `VITE_API_URL`, headers JSON, normalisasi error.
  - Fungsi: `getProducts`, `getProductById`, `createProduct`, `updateProduct`, `deleteProduct`.

## Desain & Tailwind
- Gaya minimal, responsif.
- Palet: netral (abu-abu), aksen biru untuk aksi utama.
- Komponen utilitas: `Button`, `Input`, `Select`, `Table`, `Modal`, `Pagination`.
- Tailwind `content` mencakup `index.html` dan `src/**/*.{ts,tsx}`.

## UX & Aksesibilitas
- Loading skeleton untuk tabel.
- Empty state jelas dengan CTA.
- Modal: focus trap, ESC untuk tutup, klik overlay menutup (opsional).
- Keyboard: `Tab` traversal yang benar; Enter untuk submit saat valid.
- Pesan error dan sukses yang ringkas.

## Non-Fungsional
- TypeScript strict, struktur folder modular: `components/`, `pages/`, `lib/`, `types/`.
- ESLint + Prettier untuk konsistensi.
- Hindari dead code dan side effect yang tidak perlu.
- Konfigurasi `.env` lokal, gunakan `VITE_API_URL` untuk integrasi API.

## Acceptance Criteria
- Struktur root berisi `backend/`, `frontend-dashboard/`, `frontend-client/`, dan `README.md`.
- Dashboard menampilkan halaman `Products` dengan:
  - Tabel list dengan kolom dan aksi sesuai spesifikasi.
  - Search, filter status, sort, pagination berfungsi dan sinkron dengan URL.
  - CRUD lengkap: create, edit, delete bekerja dengan integrasi API.
  - Loading dan empty state tampil sesuai kondisi.
- Koneksi backend via `VITE_API_URL` dapat dikonfigurasi tanpa perubahan kode selain env.

## Catatan Implementasi (Ringkas)
- Backend perlu menyediakan endpoint sesuai kontrak untuk UI berfungsi; detail implementasi backend tidak termasuk dalam dokumen ini.
- Frontend client tidak didetailkan; cukup scaffold dan health check sederhana.