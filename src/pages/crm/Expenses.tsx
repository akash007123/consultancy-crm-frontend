import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { expenseData } from '@/data/mockData';
import { Plus, Receipt } from 'lucide-react';

export default function ExpensesPage() {
  const total = expenseData.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Expenses</h1>
          <p className="text-sm text-muted-foreground">Total: ₹{total.toLocaleString()}</p>
        </div>
        <Button className="gradient-hero text-primary-foreground border-0">
          <Plus className="w-4 h-4 mr-2" /> Submit Expense
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {expenseData.map((e, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{e.category}</p>
                <p className="text-lg font-heading font-bold text-foreground">₹{e.amount.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
