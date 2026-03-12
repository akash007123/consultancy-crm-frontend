import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { attendance } from '@/data/mockData';

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground">Today's attendance overview</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Present', value: attendance.filter(a => a.status === 'present').length, cls: 'text-success' },
          { label: 'Late', value: attendance.filter(a => a.status === 'late').length, cls: 'text-warning' },
          { label: 'Absent', value: attendance.filter(a => a.status === 'absent').length, cls: 'text-destructive' },
        ].map((s, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-heading font-bold ${s.cls}`}>{s.value}</p>
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
                  <th className="text-left p-4 font-medium text-muted-foreground">Check In</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Check Out</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Hours</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(a => (
                  <tr key={a.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{a.employee}</td>
                    <td className="p-4 text-muted-foreground">{a.checkIn}</td>
                    <td className="p-4 text-muted-foreground hidden sm:table-cell">{a.checkOut}</td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{a.hours}</td>
                    <td className="p-4">
                      <Badge className={
                        a.status === 'present' ? 'bg-success/10 text-success border-success/20' :
                        a.status === 'late' ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-destructive/10 text-destructive border-destructive/20'
                      }>
                        {a.status}
                      </Badge>
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
