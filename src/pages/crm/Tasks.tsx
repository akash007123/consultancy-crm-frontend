import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { tasks } from '@/data/mockData';
import { Plus, Calendar } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground">{tasks.length} tasks</p>
        </div>
        <Button className="gradient-hero text-primary-foreground border-0">
          <Plus className="w-4 h-4 mr-2" /> New Task
        </Button>
      </div>

      <div className="grid gap-4">
        {tasks.map(t => (
          <Card key={t.id} className="shadow-card">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-semibold text-foreground">{t.title}</h3>
                    <Badge className={
                      t.priority === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      t.priority === 'medium' ? 'bg-warning/10 text-warning border-warning/20' :
                      'bg-muted text-muted-foreground'
                    }>
                      {t.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>Assigned: {t.assignee}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {t.dueDate}</span>
                  </div>
                </div>
                <Badge variant={t.status === 'completed' ? 'default' : 'secondary'} className={
                  t.status === 'completed' ? 'bg-success/10 text-success border-success/20' :
                  t.status === 'in-progress' ? 'bg-primary/10 text-primary border-primary/20' :
                  'bg-muted text-muted-foreground'
                }>
                  {t.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
