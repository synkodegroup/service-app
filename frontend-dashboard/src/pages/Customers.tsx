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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, MoreHorizontal, Mail } from 'lucide-react';

const dummyCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', orders: 12, spent: 1234.50, joined: '2023-05-10' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 8, spent: 789.99, joined: '2023-06-15' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', orders: 15, spent: 2456.00, joined: '2023-04-20' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', orders: 5, spent: 425.75, joined: '2023-08-01' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', orders: 20, spent: 3789.99, joined: '2023-03-12' },
  { id: 6, name: 'Diana Martinez', email: 'diana@example.com', orders: 7, spent: 899.50, joined: '2023-07-22' },
];

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export default function Customers() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-9" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Customers</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>${customer.spent.toFixed(2)}</TableCell>
                  <TableCell>{customer.joined}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
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
