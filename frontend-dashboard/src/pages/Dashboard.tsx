import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1% from last month',
      icon: DollarSign,
    },
    {
      title: 'Orders',
      value: '2,350',
      change: '+12.5% from last month',
      icon: ShoppingCart,
    },
    {
      title: 'Customers',
      value: '1,842',
      change: '+8.2% from last month',
      icon: Users,
    },
    {
      title: 'Products',
      value: '567',
      change: '+3 new this week',
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h2 className="text-sm font-medium">
                  {stat.title}
                </h2>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Order #{1000 + i} completed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {i} hours ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Top Products</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Wireless Headphones', 'Smart Watch', 'Laptop Stand', 'USB-C Cable'].map((product) => (
                <div key={product} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded bg-muted" />
                    <div>
                      <p className="text-sm font-medium">{product}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 100 + 50)} sold
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    ${(Math.random() * 100 + 20).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
