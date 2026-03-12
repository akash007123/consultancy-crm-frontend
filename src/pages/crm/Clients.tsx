import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { clients } from '@/data/mockData';
import { Plus, Search, Building2 } from 'lucide-react';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const filtered = clients.filter(c =>
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground">{clients.length} total clients</p>
        </div>
        <Button className="gradient-hero text-primary-foreground border-0">
          <Plus className="w-4 h-4 mr-2" /> Add Client
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <Card key={c.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-semibold text-foreground truncate">{c.company}</h3>
                  <p className="text-sm text-muted-foreground">{c.contact}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.industry} • {c.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
