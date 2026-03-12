import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Map, Calendar } from 'lucide-react';

const beats = [
  { id: 1, name: 'North Zone Route', employee: 'Amit Sharma', clients: 5, date: '2024-01-15', status: 'Active' },
  { id: 2, name: 'East Market Beat', employee: 'Priya Patel', clients: 3, date: '2024-01-15', status: 'Active' },
  { id: 3, name: 'South District Plan', employee: 'Rahul Verma', clients: 4, date: '2024-01-16', status: 'Scheduled' },
  { id: 4, name: 'West Industrial Area', employee: 'Sneha Reddy', clients: 6, date: '2024-01-16', status: 'Scheduled' },
];

export default function BeatPlanningPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Beat Planning</h1>
          <p className="text-sm text-muted-foreground">Plan and assign daily field routes</p>
        </div>
        <Button className="gradient-hero text-primary-foreground border-0">
          <Plus className="w-4 h-4 mr-2" /> Create Beat Plan
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {beats.map(b => (
          <Card key={b.id} className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Map className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-foreground">{b.name}</h3>
                  <p className="text-sm text-muted-foreground">{b.employee} • {b.clients} clients</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{b.date}</span>
                    <span className={`text-xs font-medium ml-auto ${b.status === 'Active' ? 'text-success' : 'text-warning'}`}>{b.status}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
