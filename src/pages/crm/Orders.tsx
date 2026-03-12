import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText } from 'lucide-react';

const orders = [
  { id: 'INV-001', client: 'TechVista Solutions', amount: 125000, date: '2026-03-08', status: 'paid' },
  { id: 'INV-002', client: 'GreenLeaf Pharma', amount: 85000, date: '2026-03-05', status: 'pending' },
  { id: 'INV-003', client: 'BuildRight Construction', amount: 210000, date: '2026-02-28', status: 'paid' },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Orders & Invoices</h1>
          <p className="text-sm text-muted-foreground">{orders.length} orders</p>
        </div>
        <Button className="gradient-hero text-primary-foreground border-0">
          <Plus className="w-4 h-4 mr-2" /> Create Order
        </Button>
      </div>
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Invoice</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Client</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> {o.id}
                    </td>
                    <td className="p-4 text-foreground">{o.client}</td>
                    <td className="p-4 text-muted-foreground hidden sm:table-cell">{o.date}</td>
                    <td className="p-4 font-medium text-foreground">₹{o.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge className={o.status === 'paid' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}>
                        {o.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
