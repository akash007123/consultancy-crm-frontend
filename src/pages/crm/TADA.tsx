import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const entries = [
  { id: 1, employee: 'Amit Sharma', ta: 1500, da: 800, total: 2300, date: '2024-01-15', approval: 'Approved' },
  { id: 2, employee: 'Priya Patel', ta: 1200, da: 600, total: 1800, date: '2024-01-14', approval: 'Pending (Manager)' },
  { id: 3, employee: 'Rahul Verma', ta: 2000, da: 1000, total: 3000, date: '2024-01-13', approval: 'Pending (Admin)' },
];

export default function TADAPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">TA / DA Management</h1>
          <p className="text-sm text-muted-foreground">Travel & Daily Allowance claims</p>
        </div>
        <Button className="gradient-hero text-primary-foreground border-0">
          <Plus className="w-4 h-4 mr-2" /> Submit Claim
        </Button>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Claims', value: '₹7,100', color: 'text-primary' },
          { label: 'Approved', value: '₹2,300', color: 'text-success' },
          { label: 'Pending', value: '₹4,800', color: 'text-warning' },
        ].map((s, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Employee</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">TA</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">DA</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Total</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Approval</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{e.employee}</td>
                    <td className="p-4 text-muted-foreground">₹{e.ta.toLocaleString()}</td>
                    <td className="p-4 text-muted-foreground">₹{e.da.toLocaleString()}</td>
                    <td className="p-4 font-medium text-foreground">₹{e.total.toLocaleString()}</td>
                    <td className="p-4 text-muted-foreground">{e.date}</td>
                    <td className="p-4">
                      <Badge className={
                        e.approval === 'Approved' ? 'bg-success/10 text-success border-success/20' :
                        'bg-warning/10 text-warning border-warning/20'
                      }>{e.approval}</Badge>
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
