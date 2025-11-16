import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type Product = {
  id: string
  name: string
  price: number
  stock: number
  status: 'active' | 'inactive'
}

type Pagination = {
  page: number
  page_size: number
  total_items: number
  total_pages: number
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

console.log("API_BASE", API_BASE)

export default function Products() {
  const { toast } = useToast()
  const [items, setItems] = useState<Product[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(false)
  const [, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)

  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [current, setCurrent] = useState<Product | null>(null)

  const [formName, setFormName] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formStock, setFormStock] = useState('')
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active')

  const validForm = useMemo(() => {
    const name = formName.trim()
    const price = Number(formPrice)
    const stock = Number(formStock)
    return name.length >= 3 && price > 0 && stock >= 0
  }, [formName, formPrice, formStock])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({ page: String(page), page_size: String(pageSize), search: search })
      const res = await fetch(`${API_BASE}/api/v1/products?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setItems(data.data ?? [])
      setPagination(data.pagination ?? null)
    } catch (e: any) {
      setError(e?.message ?? 'Error')
      toast({ title: 'Failed to load', description: e?.message ?? 'Error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [page, pageSize, search])

  const resetForm = () => {
    setFormName('')
    setFormPrice('')
    setFormStock('')
    setFormStatus('active')
  }

  const onCreate = async () => {
    if (!validForm) return
    try {
      setLoading(true)
      const body = { name: formName.trim(), price: Number(formPrice), stock: Number(formStock), status: formStatus }
      const res = await fetch(`${API_BASE}/api/v1/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Create failed')
      toast({ title: 'Product created' })
      setOpenCreate(false)
      resetForm()
      fetchProducts()
    } catch (e: any) {
      toast({ title: 'Create error', description: e?.message ?? 'Error' })
    } finally {
      setLoading(false)
    }
  }

  const onEditOpen = (p: Product) => {
    setCurrent(p)
    setFormName(p.name)
    setFormPrice(String(p.price))
    setFormStock(String(p.stock))
    setFormStatus(p.status)
    setOpenEdit(true)
  }

  const onUpdate = async () => {
    if (!current || !validForm) return
    try {
      setLoading(true)
      const body = { name: formName.trim(), price: Number(formPrice), stock: Number(formStock), status: formStatus }
      const res = await fetch(`${API_BASE}/api/v1/products/${current.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Update failed')
      toast({ title: 'Product updated' })
      setOpenEdit(false)
      setCurrent(null)
      resetForm()
      fetchProducts()
    } catch (e: any) {
      toast({ title: 'Update error', description: e?.message ?? 'Error' })
    } finally {
      setLoading(false)
    }
  }

  const onDeleteOpen = (p: Product) => { setCurrent(p); setOpenDelete(true) }
  const onDelete = async () => {
    if (!current) return
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/v1/products/${current.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast({ title: 'Product deleted' })
      setOpenDelete(false)
      setCurrent(null)
      fetchProducts()
    } catch (e: any) {
      toast({ title: 'Delete error', description: e?.message ?? 'Error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setOpenCreate(true)} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Products</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                      {product.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEditOpen(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteOpen(product)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {pagination ? `Page ${pagination.page} of ${pagination.total_pages}` : ''}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={loading || page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
              <Button variant="outline" disabled={loading || (pagination ? page >= pagination.total_pages : true)} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-2">
                <Button variant={formStatus === 'active' ? 'default' : 'outline'} onClick={() => setFormStatus('active')}>Active</Button>
                <Button variant={formStatus === 'inactive' ? 'default' : 'outline'} onClick={() => setFormStatus('inactive')}>Inactive</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancel</Button>
            <Button onClick={onCreate} disabled={!validForm || loading}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name2">Name</Label>
              <Input id="name2" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price2">Price</Label>
                <Input id="price2" type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock2">Stock</Label>
                <Input id="stock2" type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-2">
                <Button variant={formStatus === 'active' ? 'default' : 'outline'} onClick={() => setFormStatus('active')}>Active</Button>
                <Button variant={formStatus === 'inactive' ? 'default' : 'outline'} onClick={() => setFormStatus('inactive')}>Inactive</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button onClick={onUpdate} disabled={!validForm || loading}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
