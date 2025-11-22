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
import { Search, MoreHorizontal, Eye } from 'lucide-react';

const dummyOrders = [
  { id: '#1001', customer: 'John Doe', date: '2024-01-15', total: 234.50, status: 'completed' },
  { id: '#1002', customer: 'Jane Smith', date: '2024-01-15', total: 89.99, status: 'processing' },
  { id: '#1003', customer: 'Bob Johnson', date: '2024-01-14', total: 456.00, status: 'completed' },
  { id: '#1004', customer: 'Alice Brown', date: '2024-01-14', total: 125.75, status: 'pending' },
  { id: '#1005', customer: 'Charlie Wilson', date: '2024-01-13', total: 789.99, status: 'completed' },
  { id: '#1006', customer: 'Diana Martinez', date: '2024-01-13', total: 199.50, status: 'cancelled' },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'default';
    case 'processing':
      return 'secondary';
    case 'pending':
      return 'outline';
    case 'cancelled':
      return 'destructive';
    default:
      return 'default';
  }
};

export default function Orders() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-9" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Recent Orders</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
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
        </CardContent>
      </Card>
    </div>
  );
}