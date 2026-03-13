import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { attendance as mockAttendance } from '@/data/mockData';
import { useAuthStore } from '@/store/authStore';
import { attendanceApi, AttendanceCheckoutPayload } from '@/lib/api';
import CheckInOutButton from '@/components/CheckInOutButton/CheckInOutButton';

export default function AttendancePage() {
  const { user } = useAuthStore();
  const [attendance] = useState(mockAttendance);
  
  // Check if current user is an employee (not admin/manager/hr)
  const isEmployee = user?.role === 'employee';
  
  // Handle checkout API call
  const handleCheckout = async (data: Omit<AttendanceCheckoutPayload, 'employeeId'>) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    
    const payload: AttendanceCheckoutPayload = {
      employeeId: user.id,
      ...data,
    };
    
    const response = await attendanceApi.checkout(payload);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to submit checkout');
    }
    
    return response;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground">Today's attendance overview</p>
      </div>

      {/* Employee Check In/Out Section */}
      {isEmployee && (
        <Card className="shadow-card border-primary/20">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold">My Attendance</h2>
              <p className="text-sm text-muted-foreground">
                Welcome, {user?.name}!
              </p>
            </div>
            <CheckInOutButton onCheckout={handleCheckout} />
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Present', value: attendance.filter(a => a.status === 'present').length, cls: 'text-green-600' },
          { label: 'Late', value: attendance.filter(a => a.status === 'late').length, cls: 'text-yellow-600' },
          { label: 'Absent', value: attendance.filter(a => a.status === 'absent').length, cls: 'text-red-600' },
        ].map((s, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-heading font-bold ${s.cls}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Table */}
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
                        a.status === 'present' ? 'bg-green-100 text-green-800 border-green-200' :
                        a.status === 'late' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-red-100 text-red-800 border-red-200'
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
