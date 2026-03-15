import { useState, useRef, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar as CalendarIcon, Clock, User, Tag, X, Loader2 } from 'lucide-react';
import AttendanceFilter, { ViewType } from '@/components/AttendanceFilter';
import AttendanceModal from '@/components/AttendanceModal';
import { attendanceApi, AttendanceRecord } from '@/lib/api';

// Event type definition
interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  allDay?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps: {
    description?: string;
    type?: 'meeting' | 'task' | 'reminder' | 'event';
    assignedTo?: string;
    location?: string;
  };
}

// Sample events for demonstration
const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    allDay: true,
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    extendedProps: {
      description: 'Weekly team sync-up',
      type: 'meeting',
      assignedTo: 'All Team',
      location: 'Conference Room A'
    }
  },
  {
    id: '2',
    title: 'Client Presentation',
    start: new Date(new Date().setDate(new Date().getDate() + 3)),
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
    extendedProps: {
      description: 'Q1 Review with ABC Corp',
      type: 'meeting',
      assignedTo: 'John Doe',
      location: 'Client Office'
    }
  },
  {
    id: '3',
    title: 'Project Deadline',
    start: new Date(new Date().setDate(new Date().getDate() + 5)),
    allDay: true,
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
    extendedProps: {
      description: 'Submit final deliverables',
      type: 'task',
      assignedTo: 'Development Team'
    }
  },
  {
    id: '4',
    title: 'Follow-up Call',
    start: new Date(new Date().setDate(new Date().getDate() - 2)),
    backgroundColor: '#10b981',
    borderColor: '#10b981',
    extendedProps: {
      description: 'Follow-up with leads',
      type: 'reminder',
      assignedTo: 'Sales Team'
    }
  },
  {
    id: '5',
    title: 'Training Session',
    start: new Date(new Date().setDate(new Date().getDate() + 7)),
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
    extendedProps: {
      description: 'New employee onboarding',
      type: 'event',
      assignedTo: 'HR Department',
      location: 'Training Room'
    }
  }
];

// Event type badge colors
const getEventTypeColor = (type?: string) => {
  switch (type) {
    case 'meeting':
      return 'bg-blue-500';
    case 'task':
      return 'bg-red-500';
    case 'reminder':
      return 'bg-green-500';
    case 'event':
      return 'bg-amber-500';
    default:
      return 'bg-gray-500';
  }
};

const getEventTypeLabel = (type?: string) => {
  switch (type) {
    case 'meeting':
      return 'Meeting';
    case 'task':
      return 'Task';
    case 'reminder':
      return 'Reminder';
    case 'event':
      return 'Event';
    default:
      return 'Event';
  }
};

// Attendance event type for calendar
interface AttendanceCalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  allDay?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps: {
    type: 'attendance';
    attendance: AttendanceRecord;
  };
}

// Get color for attendance status
const getAttendanceStatusColor = (status: string) => {
  switch (status) {
    case 'Present':
      return { bg: '#10b981', border: '#10b981' };
    case 'Half Day':
      return { bg: '#f59e0b', border: '#f59e0b' };
    case 'Absent':
      return { bg: '#ef4444', border: '#ef4444' };
    default:
      return { bg: '#6b7280', border: '#6b7280' };
  }
};

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: 'event',
    description: '',
    assignedTo: '',
    location: ''
  });

  // Attendance state
  const [viewType, setViewType] = useState<ViewType>('events');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [employeeName, setEmployeeName] = useState<string>('');
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [attendanceEvents, setAttendanceEvents] = useState<AttendanceCalendarEvent[]>([]);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch attendance when employee is selected and view is attendance
  useEffect(() => {
    if (viewType === 'attendance' && selectedEmployeeId) {
      fetchAttendance();
    }
  }, [viewType, selectedEmployeeId, currentMonth, currentYear]);

  // Fetch attendance data
  const fetchAttendance = async () => {
    if (!selectedEmployeeId) return;

    console.log('Fetching attendance for employee:', selectedEmployeeId, 'month:', currentMonth, 'year:', currentYear);

    try {
      setIsLoadingAttendance(true);
      const response = await attendanceApi.getEmployeeAttendance(
        Number(selectedEmployeeId),
        currentMonth,
        currentYear
      );

      console.log('Attendance response:', response);

      if (response.success && response.data) {
        setAttendanceRecords(response.data.attendance);
        setEmployeeName(response.data.employee.name);
        convertAttendanceToEvents(response.data.attendance);
        console.log('Attendance events set:', response.data.attendance.length);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setIsLoadingAttendance(false);
    }
  };

  // Convert attendance records to calendar events
  const convertAttendanceToEvents = (records: AttendanceRecord[]) => {
    const events: AttendanceCalendarEvent[] = records
      .map(record => {
        const colors = getAttendanceStatusColor(record.status);
        return {
          id: `attendance-${record.date}`,
          title: record.status === 'Absent' ? 'Absent' : `${record.status} - ${record.totalTime}`,
          start: record.date,
          allDay: true,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          extendedProps: {
            type: 'attendance' as const,
            attendance: record,
          },
        };
      });
    setAttendanceEvents(events);
  };

  // Handle calendar date change (month/year)
  const handleDatesSet = (dateInfo: { start: Date; end: Date }) => {
    setCurrentMonth(dateInfo.start.getMonth() + 1);
    setCurrentYear(dateInfo.start.getFullYear());
  };

  // Handle attendance event click
  const handleAttendanceEventClick = (info: { event: { extendedProps: { attendance: AttendanceRecord } } }) => {
    setSelectedAttendance(info.event.extendedProps.attendance);
    setIsAttendanceModalOpen(true);
  };

  // Refresh handler for filter
  const handleRefresh = useCallback(() => {
    fetchAttendance();
  }, [selectedEmployeeId, currentMonth, currentYear]);

  // Handle date click
  const handleDateClick = (info: { date: Date; allDay: boolean }) => {
    setNewEvent({
      ...newEvent,
      date: info.date.toISOString().split('T')[0]
    });
    setIsAddEventOpen(true);
  };

  // Handle event click
  const handleEventClick = (info: { event: { 
    id: string; 
    title: string; 
    start: Date | null; 
    end: Date | null; 
    allDay: boolean;
    backgroundColor: string;
    extendedProps: { 
      description?: string;
      type?: string;
      assignedTo?: string;
      location?: string;
    };
  } }) => {
    const event = info.event;
    const selected: CalendarEvent = {
      id: event.id,
      title: event.title,
      start: event.start || new Date(),
      end: event.end || undefined,
      allDay: event.allDay,
      backgroundColor: event.backgroundColor,
      extendedProps: {
        ...event.extendedProps,
        type: event.extendedProps.type as 'meeting' | 'task' | 'reminder' | 'event'
      }
    };
    setSelectedEvent(selected);
    setIsEventDialogOpen(true);
  };

  // Handle adding new event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const colors: Record<string, string> = {
      meeting: '#3b82f6',
      task: '#ef4444',
      reminder: '#10b981',
      event: '#8b5cf6'
    };

    const newEventObj: CalendarEvent = {
      id: String(events.length + 1),
      title: newEvent.title,
      start: newEvent.date,
      allDay: true,
      backgroundColor: colors[newEvent.type],
      borderColor: colors[newEvent.type],
      extendedProps: {
        description: newEvent.description,
        type: newEvent.type as 'meeting' | 'task' | 'reminder' | 'event',
        assignedTo: newEvent.assignedTo,
        location: newEvent.location
      }
    };

    setEvents([...events, newEventObj]);
    setIsAddEventOpen(false);
    setNewEvent({
      title: '',
      date: '',
      type: 'event',
      description: '',
      assignedTo: '',
      location: ''
    });
  };

  // Handle delete event
  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    setIsEventDialogOpen(false);
  };

  // Custom event content
  const eventContent = (eventInfo: { event: { 
    title: string; 
    extendedProps: { type?: string; attendance?: AttendanceRecord };
  } }) => {
    // Handle attendance events
    if (eventInfo.event.extendedProps.type === 'attendance') {
      const attendance = eventInfo.event.extendedProps.attendance;
      if (attendance) {
        return (
          <div className="flex flex-col gap-0.5 overflow-hidden p-1">
            <div className="flex items-center gap-1">
              <span className="truncate text-xs font-medium text-white">
                {attendance.status === 'Absent' ? 'Absent' : attendance.status}
              </span>
            </div>
            {attendance.status !== 'Absent' && (
              <>
                <div className="text-[10px] text-white/90 truncate">
                  Check In: {attendance.checkIn || '-'}
                </div>
                <div className="text-[10px] text-white/90 truncate">
                  Check Out: {attendance.checkOut || '-'}
                </div>
                {attendance.totalTime && (
                  <div className="text-[10px] text-white/90 truncate mt-0.5">
                    Total: {attendance.totalTime}
                  </div>
                )}
              </>
            )}
          </div>
        );
      }
    }
    
    // Handle regular calendar events
    return (
      <div className="flex items-center gap-1 overflow-hidden">
        <div className={`w-2 h-2 rounded-full shrink-0 ${getEventTypeColor(eventInfo.event.extendedProps.type)}`} />
        <span className="truncate text-xs">{eventInfo.event.title}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Manage your events, meetings, and tasks</p>
        </div>
        {viewType === 'events' && (
          <Button onClick={() => setIsAddEventOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
        )}
      </div>

      {/* Attendance Filter */}
      <Card>
        <CardContent className="pt-4">
          <AttendanceFilter
            viewType={viewType}
            onViewTypeChange={setViewType}
            selectedEmployeeId={selectedEmployeeId}
            onEmployeeChange={setSelectedEmployeeId}
            onRefresh={handleRefresh}
          />
        </CardContent>
      </Card>

      {/* Loading Indicator */}
      {viewType === 'attendance' && isLoadingAttendance && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading attendance...</span>
        </div>
      )}

      {/* Calendar Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="calendar-wrapper">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={viewType === 'attendance' && selectedEmployeeId ? attendanceEvents : events}
              dateClick={viewType === 'events' ? handleDateClick : undefined}
              eventClick={(info) => {
                if (info.event.extendedProps.type === 'attendance') {
                  handleAttendanceEventClick(info as any);
                } else {
                  handleEventClick(info as any);
                }
              }}
              eventContent={eventContent}
              height="auto"
              aspectRatio={1.5}
              eventDisplay="block"
              dayMaxEvents={3}
              moreLinkClick="popover"
              selectable={viewType === 'events'}
              editable={viewType === 'events'}
              datesSet={handleDatesSet}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'short'
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events Sidebar - Quick View */}
      {viewType === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {events.filter(e => {
              const eventDate = new Date(e.start);
              const today = new Date();
              return eventDate.toDateString() === today.toDateString();
            }).length === 0 ? (
              <p className="text-sm text-muted-foreground">No events today</p>
            ) : (
              events
                .filter(e => {
                  const eventDate = new Date(e.start);
                  const today = new Date();
                  return eventDate.toDateString() === today.toDateString();
                })
                .map(event => (
                  <div key={event.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.extendedProps.type)}`} />
                    <span className="text-sm truncate">{event.title}</span>
                  </div>
                ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {events
              .filter(e => new Date(e.start) >= new Date())
              .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
              .slice(0, 4)
              .map(event => (
                <div key={event.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.extendedProps.type)}`} />
                  <span className="text-sm truncate flex-1">{event.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {new Date(event.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Event Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { type: 'meeting', label: 'Meetings', color: 'bg-blue-500' },
              { type: 'task', label: 'Tasks', color: 'bg-red-500' },
              { type: 'reminder', label: 'Reminders', color: 'bg-green-500' },
              { type: 'event', label: 'Events', color: 'bg-amber-500' }
            ].map(item => (
              <div key={item.type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm">{item.label}</span>
                <Badge variant="secondary" className="ml-auto">
                  {events.filter(e => e.extendedProps.type === item.type).length}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      )}

      {/* Event Details Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Event Details
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                <Badge className={`${getEventTypeColor(selectedEvent.extendedProps.type)} text-white`}>
                  {getEventTypeLabel(selectedEvent.extendedProps.type)}
                </Badge>
              </div>
              
              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {new Date(selectedEvent.start).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                {selectedEvent.extendedProps.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedEvent.extendedProps.location}</span>
                  </div>
                )}
                
                {selectedEvent.extendedProps.assignedTo && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedEvent.extendedProps.assignedTo}</span>
                  </div>
                )}
                
                {selectedEvent.extendedProps.description && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">{selectedEvent.extendedProps.description}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  Delete Event
                </Button>
                <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event, meeting, or task
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Event Type</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                placeholder="Enter assignee name"
                value={newEvent.assignedTo}
                onChange={(e) => setNewEvent({ ...newEvent, assignedTo: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter event description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent} disabled={!newEvent.title || !newEvent.date}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attendance Modal */}
      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        attendance={selectedAttendance}
        employeeName={employeeName}
      />
    </div>
  );
}
