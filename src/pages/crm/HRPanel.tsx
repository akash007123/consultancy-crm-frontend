import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, UserPlus, Briefcase, FileText } from 'lucide-react';

const candidates = [
  { id: 1, name: 'Vikram Singh', position: 'Sales Executive', status: 'Interview Scheduled', date: '2024-01-16' },
  { id: 2, name: 'Anita Desai', position: 'HR Manager', status: 'Shortlisted', date: '2024-01-15' },
  { id: 3, name: 'Karan Mehta', position: 'Field Officer', status: 'Offer Sent', date: '2024-01-14' },
  { id: 4, name: 'Neha Gupta', position: 'Account Manager', status: 'Applied', date: '2024-01-13' },
];

const jobPostings = [
  { title: 'Sales Executive', openings: 3, applications: 12, status: 'Active' },
  { title: 'Field Officer', openings: 5, applications: 8, status: 'Active' },
  { title: 'HR Manager', openings: 1, applications: 6, status: 'Closed' },
];

export default function HRPanelPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">HR Panel</h1>
          <p className="text-sm text-muted-foreground">Candidate & job management</p>
        </div>
        <div className="flex gap-2">
          <Button className="gradient-hero text-primary-foreground border-0">
            <UserPlus className="w-4 h-4 mr-2" /> Add Candidate
          </Button>
          <Button variant="outline">
            <Briefcase className="w-4 h-4 mr-2" /> Post Job
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {jobPostings.map((j, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{j.title}</h3>
                  <p className="text-sm text-muted-foreground">{j.openings} openings • {j.applications} applications</p>
                  <span className={`text-xs font-medium ${j.status === 'Active' ? 'text-success' : 'text-muted-foreground'}`}>{j.status}</span>
                </div>
              </div>
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
                  <th className="text-left p-4 font-medium text-muted-foreground">Candidate</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Position</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(c => (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{c.name}</td>
                    <td className="p-4 text-muted-foreground">{c.position}</td>
                    <td className="p-4">
                      <span className={`text-xs font-medium ${
                        c.status === 'Offer Sent' ? 'text-success' :
                        c.status === 'Interview Scheduled' ? 'text-primary' :
                        c.status === 'Shortlisted' ? 'text-warning' : 'text-muted-foreground'
                      }`}>{c.status}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">{c.date}</td>
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
