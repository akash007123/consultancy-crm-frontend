import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Building, 
  FileText, 
  TrendingUp,
  AlertCircle 
} from 'lucide-react';
import { VisitDetail } from '@/lib/api';

interface VisitViewModalProps {
  visit: VisitDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

export default function VisitViewModal({ visit, open, onOpenChange, onEdit }: VisitViewModalProps) {
  if (!visit) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    // Convert 24h format to 12h format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold">Visit Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Card */}
          <Card className="gradient-card">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    {visit.clientName}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Visited by: <span className="font-medium">{visit.employeeName}</span>
                  </p>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {formatDate(visit.date)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Time & Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Check In</p>
                  <p className="font-semibold">{formatTime(visit.checkInTime)}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Check Out</p>
                  <p className="font-semibold">
                    {visit.checkOutTime ? formatTime(visit.checkOutTime) : '-'}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-semibold">{visit.location}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purpose */}
          {visit.purpose && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Purpose of Visit
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {visit.purpose}
              </p>
            </div>
          )}

          {/* Remarks */}
          {visit.remarks && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Remarks
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {visit.remarks}
              </p>
            </div>
          )}

          {/* Outcome */}
          {visit.outcome && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Outcome
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {visit.outcome}
              </p>
            </div>
          )}

          {/* Next Follow-up */}
          {visit.nextFollowup && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Next Follow-up
              </h4>
              <Badge variant="secondary" className="text-sm">
                {formatDate(visit.nextFollowup)}
              </Badge>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t text-xs text-muted-foreground">
            <p>Created: {new Date(visit.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(visit.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
