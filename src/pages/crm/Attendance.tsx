import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { attendanceApi, employeeApi, BackendEmployee, AttendanceAllResponse } from '@/lib/api';
import CheckInOutButton from '@/components/CheckInOutButton/CheckInOutButton';

// Helper to format time from datetime string
function formatTime(dateTime: string | null): string {
  if (!dateTime) return '-';
  const date = new Date(dateTime);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Helper to calculate total hours from check-in and check-out
function calculateHours(checkIn: string | null, checkOut: string | null): string {
  if (!checkIn || !checkOut) return '-';
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return '-';
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

// Helper to determine status based on check-in time
function getStatus(checkIn: string | null): 'present' | 'late' | 'absent' {
  if (!checkIn) return 'absent';
  const checkInDate = new Date(checkIn);
  const threshold = new Date(checkInDate);
  threshold.setHours(9, 30, 0, 0); // 9:30 AM threshold
  
  if (checkInDate <= threshold) {
    return 'present';
  }
  return 'late';
}

interface AttendanceRecord {
  id: number;
  employeeId: string;
  employeeName: string;
  department?: string;
  checkIn: string | null;
  checkOut: string | null;
  totalTime: string;
  status: 'present' | 'late' | 'absent';
}

export default function AttendancePage() {
  const { user } = useAuthStore();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Record<string, BackendEmployee>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check user role
  const userRole = user?.role;
  const isEmployee = userRole === 'employee';
  const isAdminOrHR = userRole === 'admin' || userRole === 'sub-admin' || userRole === 'hr' || userRole === 'manager';
  
  // Fetch employees to map IDs to names (needed for absent employee detection)
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeApi.getAll();
        if (response.success && response.data?.employees) {
          const employeeMap: Record<string, BackendEmployee> = {};
          response.data.employees.forEach((emp: BackendEmployee) => {
            employeeMap[emp.id.toString()] = emp;
          });
          setEmployees(employeeMap);
        }
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };
    
    fetchEmployees();
  }, []);
  
  // Fetch attendance data based on role
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        
        // If employee, fetch only their attendance; otherwise fetch all
        const params = isEmployee && user?.id 
          ? { date: today, employeeId: user.id.toString() }
          : { date: today };
        
        const response: AttendanceAllResponse = await attendanceApi.getAll(params);
        
        if (response.success && response.data?.attendance) {
          // Map attendance records with employee names from joined query
          const records: AttendanceRecord[] = response.data.attendance.map(record => {
            // Use first_name/last_name from JOIN query, fallback to employees map
            let employeeName = `Employee ${record.employee_id}`;
            if (record.first_name && record.last_name) {
              employeeName = `${record.first_name} ${record.last_name}`;
            } else if (employees[record.employee_id]) {
              const emp = employees[record.employee_id];
              employeeName = `${emp.firstName} ${emp.lastName}`;
            }
            
            return {
              id: record.id,
              employeeId: record.employee_id,
              employeeName,
              department: record.department,
              checkIn: record.check_in_time,
              checkOut: record.check_out_time,
              totalTime: record.total_time || calculateHours(record.check_in_time, record.check_out_time),
              status: getStatus(record.check_in_time),
            };
          });
          
          setAttendance(records);
        } else {
          setAttendance([]);
        }
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Failed to load attendance data');
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch when employees are loaded
    if (Object.keys(employees).length > 0) {
      fetchAttendance();
    }
  }, [employees, isEmployee, user?.id]);
  
  // Handle checkout API call
  const handleCheckout = async (data: { checkInTime: string; checkOutTime: string; totalTime: string; report: string }) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    
    const payload = {
      employeeId: user.id.toString(),
      ...data,
    };
    
    const response = await attendanceApi.checkout(payload);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to submit checkout');
    }
    
    return response;
  };
  
  // For admin/HR view - calculate stats from all attendance
  const getAllRecords = (): AttendanceRecord[] => {
    if (isEmployee) {
      return attendance;
    }
    
    // For admin/HR - get all employees and determine absent ones
    const activeEmployees = Object.values(employees).filter(e => e.status === 'active');
    const checkedInEmployeeIds = new Set(attendance.map(a => a.employeeId));
    const absentEmployeeIds = activeEmployees
      .map(e => e.id.toString())
      .filter(id => !checkedInEmployeeIds.has(id));
    
    // Create records for absent employees
    const absentRecords: AttendanceRecord[] = absentEmployeeIds.map(id => {
      const emp = employees[id];
      return {
        id: -parseInt(id),
        employeeId: id,
        employeeName: emp ? `${emp.firstName} ${emp.lastName}` : `Employee ${id}`,
        department: emp?.department,
        checkIn: null,
        checkOut: null,
        totalTime: '-',
        status: 'absent' as const,
      };
    });
    
    return [...attendance, ...absentRecords].sort((a, b) => {
      // Sort by status: present first, then late, then absent
      const statusOrder = { present: 0, late: 1, absent: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  };
  
  // Calculate stats for admin/HR view
  const allRecords = getAllRecords();
  const presentCount = allRecords.filter(a => a.status === 'present').length;
  const lateCount = allRecords.filter(a => a.status === 'late').length;
  const absentCount = allRecords.filter(a => a.status === 'absent').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground">
          {isEmployee ? 'My attendance record' : "Today's attendance overview"}
        </p>
      </div>

      {/* Employee Check In/Out Section - Only for employees */}
      {/* {isEmployee && (
        <Card className="shadow-card border-primary/20">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold">My Attendance</h2>
              <p className="text-sm text-muted-foreground">
                Welcome, {user?.name}!
              </p>
            </div>
            <CheckInOutButton onCheckout={handleCheckout} variant="default" />
          </CardContent>
        </Card>
      )} */}

      {/* Stats Grid - Only for admin/HR */}
      {isAdminOrHR && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-heading font-bold text-green-600">{presentCount}</p>
              <p className="text-xs text-muted-foreground">Present</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-heading font-bold text-yellow-600">{lateCount}</p>
              <p className="text-xs text-muted-foreground">Late</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-heading font-bold text-red-600">{absentCount}</p>
              <p className="text-xs text-muted-foreground">Absent</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance Table */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading attendance data...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {isAdminOrHR && (
                      <th className="text-left p-4 font-medium text-muted-foreground">Employee</th>
                    )}
                    <th className="text-left p-4 font-medium text-muted-foreground">Check In</th>
                    <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Check Out</th>
                    <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Hours</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allRecords.length === 0 ? (
                    <tr>
                      <td colSpan={isAdminOrHR ? 5 : 4} className="p-8 text-center text-muted-foreground">
                        No attendance records found for today
                      </td>
                    </tr>
                  ) : (
                    allRecords.map(a => (
                      <tr key={a.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        {isAdminOrHR && (
                          <td className="p-4 font-medium text-foreground">{a.employeeName}</td>
                        )}
                        <td className="p-4 text-muted-foreground">{formatTime(a.checkIn)}</td>
                        <td className="p-4 text-muted-foreground hidden sm:table-cell">{formatTime(a.checkOut)}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">
                          {a.checkIn && a.checkOut ? calculateHours(a.checkIn, a.checkOut) : '-'}
                        </td>
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
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
