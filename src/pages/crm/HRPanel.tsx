import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, UserPlus, Briefcase, FileText, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import { candidateApi, Candidate } from '@/lib/api';
import { toast } from 'sonner';
import CandidateFormModal from '@/components/Modal/CandidateFormModal';
import CandidateViewModal from '@/components/Modal/CandidateViewModal';
import DeleteModal from '@/components/Modal/DeleteModal';

// Mock job postings - these can be made dynamic later
const jobPostings = [
  { title: 'Sales Executive', openings: 3, applications: 12, status: 'Active' },
  { title: 'Field Officer', openings: 5, applications: 8, status: 'Active' },
  { title: 'HR Manager', openings: 1, applications: 6, status: 'Closed' },
];

export default function HRPanelPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Force refresh
  
  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  // Selected candidate for editing/viewing/deleting
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch candidates on mount and when refreshKey changes
  useEffect(() => {
    fetchCandidates();
  }, [refreshKey]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      console.log('Fetching candidates...');
      const response = await candidateApi.getAll();
      console.log('Candidates response:', JSON.stringify(response));
      
      if (response.success && response.data) {
        if (Array.isArray(response.data)) {
          setCandidates(response.data);
        } else if (response.data.candidates && Array.isArray(response.data.candidates)) {
          setCandidates(response.data.candidates);
        } else if (response.data.candidate) {
          setCandidates([response.data.candidate]);
        } else {
          console.log('Unexpected data structure:', response.data);
          setCandidates([]);
        }
        console.log('Candidates set successfully');
      } else {
        console.log('Response not successful:', response);
        setCandidates([]);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Failed to load candidates');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = () => {
    setSelectedCandidate(null);
    setFormModalOpen(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setFormModalOpen(true);
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setViewModalOpen(true);
  };

  const handleDeleteCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCandidate) return;
    
    setIsDeleting(true);
    try {
      await candidateApi.delete(selectedCandidate.id);
      toast.success('Candidate deleted successfully');
      setDeleteModalOpen(false);
      setRefreshKey(old => old + 1);
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete candidate');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    console.log('Form success, refreshing...');
    setRefreshKey(old => old + 1); // Force re-fetch
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Offer Sent':
      case 'Accepted Offer':
        return 'text-success';
      case 'Interview Scheduled':
        return 'text-primary';
      case 'Shortlisted':
        return 'text-warning';
      case 'Pending':
      case 'Applied':
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">HR Panel</h1>
          <p className="text-sm text-muted-foreground">Candidate & job management</p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="gradient-hero text-primary-foreground border-0" 
            onClick={handleAddCandidate}
          >
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
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : candidates.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No candidates found</p>
                <Button 
                  variant="link" 
                  onClick={handleAddCandidate}
                  className="mt-2"
                >
                  Add your first candidate
                </Button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">Candidate</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Position</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map(c => (
                    <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground">{c.name}</td>
                      <td className="p-4 text-muted-foreground">{c.position}</td>
                      <td className="p-4">
                        <span className={`text-xs font-medium ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{formatDate(c.createdAt)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewCandidate(c)}
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCandidate(c)}
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCandidate(c)}
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Candidate Modal */}
      <CandidateFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        candidate={selectedCandidate}
        onSuccess={handleFormSuccess}
      />

      {/* View Candidate Modal */}
      <CandidateViewModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        candidate={selectedCandidate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Candidate"
        description="Are you sure you want to delete this candidate? This action cannot be undone."
        itemName={selectedCandidate?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}
