import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const invoices = [
  { id: 'INV-001', client: 'TechCorp Solutions', amount: 45000, gst: 8100, total: 53100, date: '2024-01-15', status: 'Paid' },
  { id: 'INV-002', client: 'Global Industries', amount: 32000, gst: 5760, total: 37760, date: '2024-01-12', status: 'Pending' },
  { id: 'INV-003', client: 'StartUp Hub', amount: 18000, gst: 3240, total: 21240, date: '2024-01-10', status: 'Overdue' },
  { id: 'INV-004', client: 'Pinnacle Group', amount: 55000, gst: 9900, total: 64900, date: '2024-01-08', status: 'Paid' },
];

export default function InvoicePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground">Generate and manage invoices</p>
        </div>
        <Button className="gradient-hero text-primary-foreground border-0">
          <Plus className="w-4 h-4 mr-2" /> Create Invoice
        </Button>
      </div>
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Invoice #</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Client</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">GST</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Total</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{inv.id}</td>
                    <td className="p-4 text-muted-foreground">{inv.client}</td>
                    <td className="p-4 text-muted-foreground">₹{inv.amount.toLocaleString()}</td>
                    <td className="p-4 text-muted-foreground hidden sm:table-cell">₹{inv.gst.toLocaleString()}</td>
                    <td className="p-4 font-medium text-foreground">₹{inv.total.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge className={
                        inv.status === 'Paid' ? 'bg-success/10 text-success border-success/20' :
                        inv.status === 'Pending' ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-destructive/10 text-destructive border-destructive/20'
                      }>{inv.status}</Badge>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
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
