const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseURL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    let err
    try {
      err = await res.json()
    } catch {
      err = { error: { code: 'network', message: res.statusText } }
    }
    throw err
  }
  return res.json()
}

export type Product = {
  id: string
  name: string
  price: number
  stock: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export type ListParams = {
  page?: number
  page_size?: number
  search?: string
  status?: 'active' | 'inactive' | ''
  sort_by?: 'name' | 'price' | 'stock' | 'updated_at'
  sort_dir?: 'asc' | 'desc'
}

export type ListResponse = {
  data: Product[]
  pagination: { page: number; page_size: number; total_items: number; total_pages: number }
}

export const getProducts = (params: ListParams = {}) => {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') q.set(k, String(v))
  })
  return request<ListResponse>(`/api/v1/products?${q.toString()}`)
}

export const getProductById = (id: string) => request<Product>(`/api/v1/products/${id}`)

export const createProduct = (body: Pick<Product, 'name' | 'price' | 'stock' | 'status'>) =>
  request<Product>(`/api/v1/products`, { method: 'POST', body: JSON.stringify(body) })

export const updateProduct = (id: string, body: Pick<Product, 'name' | 'price' | 'stock' | 'status'>) =>
  request<Product>(`/api/v1/products/${id}`, { method: 'PUT', body: JSON.stringify(body) })

export const deleteProduct = (id: string) => request<{ deleted: boolean }>(`/api/v1/products/${id}`, { method: 'DELETE' })

export const getHealth = () => request<{ status: string }>(`/healthz`)