import { Card, CardContent } from '@/components/ui/card';
import { visits } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Clock } from 'lucide-react';

export default function VisitsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Visit Management</h1>
          <p className="text-sm text-muted-foreground">{visits.length} visits logged</p>
        </div>
        <Button className="gradient-hero text-primary-foreground border-0">
          <Plus className="w-4 h-4 mr-2" /> Log Visit
        </Button>
      </div>

      <div className="grid gap-4">
        {visits.map(v => (
          <Card key={v.id} className="shadow-card">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{v.client}</h3>
                  <p className="text-sm text-muted-foreground">by {v.employee}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {v.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {v.checkIn} – {v.checkOut}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{v.remarks}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
