import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { Clock, LogIn, LogOut } from 'lucide-react';

// Format seconds to HH:MM:SS
const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Format Date to readable string
const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

interface CheckInOutButtonProps {
  onCheckout: (data: {
    checkInTime: string;
    checkOutTime: string;
    totalTime: string;
    report: string;
  }) => Promise<unknown>;
}

export default function CheckInOutButton({ onCheckout }: CheckInOutButtonProps) {
  const { user } = useAuthStore();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [report, setReport] = useState('');

  // Check for existing check-in on mount (page refresh handling)
  useEffect(() => {
    const storedCheckIn = localStorage.getItem('checkInTime');
    if (storedCheckIn) {
      const storedTime = new Date(storedCheckIn);
      setCheckInTime(storedTime);
      setIsCheckedIn(true);
      
      // Calculate elapsed seconds from stored check-in time
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - storedTime.getTime()) / 1000);
      setElapsedSeconds(elapsed > 0 ? elapsed : 0);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCheckedIn && checkInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - checkInTime.getTime()) / 1000);
        setElapsedSeconds(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCheckedIn, checkInTime]);

  const handleCheckIn = useCallback(() => {
    const now = new Date();
    setCheckInTime(now);
    setIsCheckedIn(true);
    setElapsedSeconds(0);
    
    // Store check-in time in localStorage for persistence
    localStorage.setItem('checkInTime', now.toISOString());
  }, []);

  const handleCheckOut = useCallback(() => {
    if (!checkInTime) return;
    setShowReportModal(true);
  }, [checkInTime]);

  const handleSubmitReport = async () => {
    if (!report.trim()) {
      alert('Please enter a work report');
      return;
    }
    
    if (!checkInTime || !user) return;
    
    setIsSubmitting(true);
    
    const now = new Date();
    const totalTime = formatTime(elapsedSeconds);
    
    try {
      await onCheckout({
        checkInTime: checkInTime.toISOString(),
        checkOutTime: now.toISOString(),
        totalTime,
        report: report.trim(),
      });
      
      // Reset state after successful submission
      setIsCheckedIn(false);
      setCheckInTime(null);
      setElapsedSeconds(0);
      setReport('');
      setShowReportModal(false);
      
      // Clear localStorage
      localStorage.removeItem('checkInTime');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to submit checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowReportModal(false);
    setReport('');
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 p-6">
        {/* Main Check In/Out Button */}
        <Button
          onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
          disabled={isSubmitting}
          className={`
            min-w-[200px] text-lg font-semibold px-8 py-6
            transition-all duration-300 ease-in-out
            ${isCheckedIn 
              ? 'bg-destructive hover:bg-destructive/90 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
            }
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⟳</span>
              Submitting...
            </span>
          ) : isCheckedIn ? (
            <span className="flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Working: {formatTime(elapsedSeconds)}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Check In
            </span>
          )}
        </Button>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {isCheckedIn ? (
            <span>
              Checked in at: {checkInTime ? formatDateTime(checkInTime) : '--'}
            </span>
          ) : (
            <span>Ready to check in</span>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
          />
          
          {/* Modal Content */}
          <div className="relative bg-background rounded-lg shadow-xl w-full max-w-md mx-4 p-6 z-10">
            <h2 className="text-xl font-bold mb-4">Work Report</h2>
            
            {/* Read-only fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Check In Time</label>
                <p className="text-foreground">
                  {checkInTime ? formatDateTime(checkInTime) : '--'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Check Out Time</label>
                <p className="text-foreground">
                  {formatDateTime(new Date())}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Working Time</label>
                <p className="text-foreground font-semibold">
                  {formatTime(elapsedSeconds)}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Work Report <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  placeholder="Describe your work today..."
                  className="mt-1 w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReport}
                disabled={isSubmitting || !report.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
