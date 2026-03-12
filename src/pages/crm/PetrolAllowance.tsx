import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Fuel } from 'lucide-react';

const entries = [
  { id: 1, employee: 'Amit Sharma', distance: 45, rate: 12, total: 540, date: '2024-01-15', status: 'Approved' },
  { id: 2, employee: 'Priya Patel', distance: 30, rate: 12, total: 360, date: '2024-01-15', status: 'Pending' },
  { id: 3, employee: 'Rahul Verma', distance: 60, rate: 12, total: 720, date: '2024-01-14', status: 'Approved' },
];

export default function PetrolAllowancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Petrol Allowance</h1>
          <p className="text-sm text-muted-foreground">Rate: ₹12/km</p>
        </div>
        <Button className="gradient-hero text-primary-foreground border-0">
          <Plus className="w-4 h-4 mr-2" /> Add Entry
        </Button>
      </div>
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Employee</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Distance (km)</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Rate</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Total</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{e.employee}</td>
                    <td className="p-4 text-muted-foreground">{e.distance} km</td>
                    <td className="p-4 text-muted-foreground">₹{e.rate}/km</td>
                    <td className="p-4 font-medium text-foreground">₹{e.total}</td>
                    <td className="p-4 text-muted-foreground">{e.date}</td>
                    <td className="p-4">
                      <span className={`text-xs font-medium ${e.status === 'Approved' ? 'text-success' : 'text-warning'}`}>{e.status}</span>
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
