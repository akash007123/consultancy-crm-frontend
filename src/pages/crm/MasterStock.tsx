import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUpDown, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const stockEntries = [
  { id: 1, item: 'Product Brochures', type: 'IN', qty: 1000, date: '2024-01-15', source: 'Head Office' },
  { id: 2, item: 'Company Merchandise', type: 'OUT', qty: 200, date: '2024-01-14', source: 'North Distributor' },
  { id: 3, item: 'Welcome Kits', type: 'IN', qty: 100, date: '2024-01-13', source: 'Vendor Supply' },
  { id: 4, item: 'ID Cards', type: 'OUT', qty: 50, date: '2024-01-12', source: 'East Distributor' },
  { id: 5, item: 'Product Samples', type: 'IN', qty: 500, date: '2024-01-11', source: 'Factory' },
];

export default function MasterStockPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Master Distributor Stock</h1>
          <p className="text-sm text-muted-foreground">Stock IN & OUT management</p>
        </div>
        <div className="flex gap-2">
          <Button className="gradient-hero text-primary-foreground border-0">
            <Plus className="w-4 h-4 mr-2" /> Stock IN
          </Button>
          <Button variant="outline">
            <ArrowUpDown className="w-4 h-4 mr-2" /> Stock OUT
          </Button>
        </div>
      </div>
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Item</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Qty</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Source/Dest</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {stockEntries.map(e => (
                  <tr key={e.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" /> {e.item}
                    </td>
                    <td className="p-4">
                      <Badge className={e.type === 'IN' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                        {e.type}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{e.qty}</td>
                    <td className="p-4 text-muted-foreground">{e.source}</td>
                    <td className="p-4 text-muted-foreground">{e.date}</td>
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
