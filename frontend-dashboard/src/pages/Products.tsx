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
import { Plus, Search, MoreHorizontal } from 'lucide-react';

const dummyProducts = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 89.99, stock: 145, status: 'active' },
  { id: 2, name: 'Smart Watch', category: 'Electronics', price: 199.99, stock: 89, status: 'active' },
  { id: 3, name: 'Laptop Stand', category: 'Accessories', price: 45.50, stock: 234, status: 'active' },
  { id: 4, name: 'USB-C Cable', category: 'Accessories', price: 12.99, stock: 567, status: 'active' },
  { id: 5, name: 'Mechanical Keyboard', category: 'Electronics', price: 129.99, stock: 0, status: 'out_of_stock' },
  { id: 6, name: 'Mouse Pad', category: 'Accessories', price: 19.99, stock: 342, status: 'active' },
];

export default function Products() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9" />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
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
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.status === 'active' ? 'default' : 'secondary'}
                    >
                      {product.status === 'active' ? 'Active' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
