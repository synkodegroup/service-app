import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
  type ListParams,
} from '@/lib/api'

type Mode = 'list' | 'create' | 'edit'

const defaultParams: Required<ListParams> = {
  page: 1,
  page_size: 10,
  search: '',
  status: '' as any,
  sort_by: 'updated_at',
  sort_dir: 'desc',
}

export default function ProductsPage() {
  const [params, setParams] = useState(defaultParams)
  const [mode, setMode] = useState<Mode>('list')
  const [editing, setEditing] = useState<Product | null>(null)
  const qc = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  })

  const createMut = useMutation({
    mutationFn: (b: Pick<Product, 'name' | 'price' | 'stock' | 'status'>) => createProduct(b),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
  const updateMut = useMutation({
    mutationFn: (b: Pick<Product, 'name' | 'price' | 'stock' | 'status'>) => updateProduct(editing!.id, b),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })

  const [form, setForm] = useState({ name: '', price: '', stock: '', status: 'active' })
  const valid = useMemo(() => {
    const name = form.name.trim()
    const price = Number(form.price)
    const stock = Number(form.stock)
    return name.length >= 3 && name.length <= 100 && price > 0 && stock >= 0 && (form.status === 'active' || form.status === 'inactive')
  }, [form])

  useEffect(() => {
    if (mode === 'edit' && editing) {
      setForm({ name: editing.name, price: String(editing.price), stock: String(editing.stock), status: editing.status })
    } else if (mode === 'create') {
      setForm({ name: '', price: '', stock: '', status: 'active' })
    }
  }, [mode, editing])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>

      <div className="flex flex-wrap gap-2 items-end mb-4">
        <div className="flex flex-col">
          <label className="text-sm">Search</label>
          <input
            className="border rounded px-2 py-1"
            placeholder="Search by name"
            value={params.search}
            onChange={(e) => setParams((p) => ({ ...p, search: e.target.value, page: 1 }))}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Status</label>
          <select
            className="border rounded px-2 py-1"
            value={params.status}
            onChange={(e) => setParams((p) => ({ ...p, status: e.target.value as any, page: 1 }))}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Sort By</label>
          <select
            className="border rounded px-2 py-1"
            value={params.sort_by}
            onChange={(e) => setParams((p) => ({ ...p, sort_by: e.target.value as any }))}
          >
            <option value="updated_at">Updated</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Direction</label>
          <select
            className="border rounded px-2 py-1"
            value={params.sort_dir}
            onChange={(e) => setParams((p) => ({ ...p, sort_dir: e.target.value as any }))}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Page Size</label>
          <select
            className="border rounded px-2 py-1"
            value={params.page_size}
            onChange={(e) => setParams((p) => ({ ...p, page_size: Number(e.target.value), page: 1 }))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <button className="ml-auto bg-blue-600 text-white px-3 py-2 rounded" onClick={() => setMode('create')}>Create Product</button>
      </div>

      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Updated At</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && Array.from({ length: params.page_size }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-3 py-2"><div className="h-4 bg-gray-200 rounded" /></td>
                <td className="px-3 py-2"><div className="h-4 bg-gray-200 rounded" /></td>
                <td className="px-3 py-2"><div className="h-4 bg-gray-200 rounded" /></td>
                <td className="px-3 py-2"><div className="h-4 bg-gray-200 rounded" /></td>
                <td className="px-3 py-2"><div className="h-4 bg-gray-200 rounded" /></td>
                <td className="px-3 py-2"></td>
              </tr>
            ))}
            {!isLoading && data && data.data.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center" colSpan={6}>
                  No products. <button className="text-blue-600 underline" onClick={() => setMode('create')}>Create one</button>
                </td>
              </tr>
            )}
            {!isLoading && data?.data.map((p: Product) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">${p.price.toFixed(2)}</td>
                <td className="px-3 py-2">{p.stock}</td>
                <td className="px-3 py-2">{p.status}</td>
                <td className="px-3 py-2">{new Date(p.updated_at).toLocaleString()}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button className="px-2 py-1 border rounded" onClick={() => { setEditing(p); setMode('edit') }}>Edit</button>
                  <button className="px-2 py-1 border rounded text-red-600" onClick={() => deleteMut.mutate(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button
          className="px-3 py-1 border rounded"
          disabled={params.page <= 1}
          onClick={() => setParams((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
        >Prev</button>
        <span>Page {data?.pagination.page ?? params.page} / {data?.pagination.total_pages ?? '–'}</span>
        <button
          className="px-3 py-1 border rounded"
          disabled={!!data && params.page >= data.pagination.total_pages}
          onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
        >Next</button>
      </div>

      {(mode === 'create' || mode === 'edit') && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">{mode === 'create' ? 'Create' : 'Edit'} Product</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm">Name</label>
                <input className="w-full border rounded px-2 py-1" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm">Price</label>
                <input type="number" step="0.01" className="w-full border rounded px-2 py-1" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm">Stock</label>
                <input type="number" className="w-full border rounded px-2 py-1" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm">Status</label>
                <select className="w-full border rounded px-2 py-1" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-3 py-1 border rounded" onClick={() => { setMode('list'); setEditing(null) }}>Cancel</button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                disabled={!valid || createMut.isPending || updateMut.isPending}
                onClick={() => {
                  const body = { name: form.name.trim(), price: Number(form.price), stock: Number(form.stock), status: form.status as Product['status'] }
                  const done = () => { setMode('list'); setEditing(null) }
                  mode === 'create' ? createMut.mutate(body, { onSuccess: done }) : updateMut.mutate(body, { onSuccess: done })
                }}
              >Save</button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600">Error loading products</div>
      )}
    </div>
  )
}