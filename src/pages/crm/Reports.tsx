import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, Users, MapPin, Clock, Receipt, Package, ShoppingCart } from 'lucide-react';

const reports = [
  { title: 'Employee Report', icon: Users, description: 'Complete employee data with roles and departments' },
  { title: 'Visit Report & DSR', icon: MapPin, description: 'Daily sales report with visit details and geo data' },
  { title: 'Attendance Report', icon: Clock, description: 'Daily/monthly attendance with late entries' },
  { title: 'Expense Report', icon: Receipt, description: 'Expense breakdown with approval status' },
  { title: 'Stock Report', icon: Package, description: 'Distributor and master stock levels' },
  { title: 'Sales Report', icon: ShoppingCart, description: 'Order and invoice analytics' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and export reports</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r, i) => (
          <Card key={i} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <r.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{r.title}</h3>
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-3.5 h-3.5 mr-1" /> Excel
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-3.5 h-3.5 mr-1" /> PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
