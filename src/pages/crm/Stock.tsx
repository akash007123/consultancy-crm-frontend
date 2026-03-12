import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';

const stockItems = [
  { name: 'Product Brochures', qty: 500, unit: 'pcs', status: 'In Stock' },
  { name: 'Company Merchandise', qty: 120, unit: 'pcs', status: 'In Stock' },
  { name: 'Welcome Kits', qty: 25, unit: 'kits', status: 'Low Stock' },
  { name: 'ID Cards', qty: 200, unit: 'pcs', status: 'In Stock' },
];

export default function StockPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Stock Management</h1>
        <p className="text-sm text-muted-foreground">Distributor and master stock overview</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {stockItems.map((s, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.qty} {s.unit}</p>
              </div>
              <span className={`text-xs font-medium ${s.status === 'Low Stock' ? 'text-warning' : 'text-success'}`}>
                {s.status}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
