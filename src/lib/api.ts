// API client for communicating with the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Token management
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

const removeToken = (): void => {
  localStorage.removeItem('token');
};

// User type from backend
export interface BackendUser {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: 'admin' | 'sub-admin' | 'manager' | 'hr' | 'employee';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Employee type from backend
export interface BackendEmployee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  joiningDate: string;
  department: string;
  role: 'admin' | 'manager' | 'hr' | 'employee';
  status: 'active' | 'inactive';
  mobile1: string;
  mobile2: string;
  address: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  bankAddress: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  otherSocial: string;
  profilePhoto: string | null;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: BackendUser;
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as { message?: string; error?: string };
    throw new Error(errorData.message || errorData.error || 'An error occurred');
  }

  return data;
}

// Auth API functions
export const authApi = {
  // Login
  login: async (mobile: string, password: string): Promise<AuthResponse> => {
    const response = await fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ mobile, password }),
    });
    
    // Store token on successful login
    if (response.data?.token) {
      setToken(response.data.token);
    }
    
    return response;
  },

  // Register/Signup
  signup: async (data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> => {
    const response = await fetchApi<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store token on successful signup
    if (response.data?.token) {
      setToken(response.data.token);
    }
    
    return response;
  },

  // Get current user (works for both users and employees)
  getMe: async (): Promise<{ success: boolean; data: { user?: BackendUser; employee?: BackendEmployee } }> => {
    return fetchApi<{ success: boolean; data: { user?: BackendUser; employee?: BackendEmployee } }>('/auth/me', {
      method: 'GET',
    });
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await fetchApi<{ success: boolean }>('/auth/logout', {
        method: 'POST',
      });
    } finally {
      // Always remove token, even if API call fails
      removeToken();
    }
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Check if user is authenticated (has valid token)
  isAuthenticated: (): boolean => {
    return !!getToken();
  },
};

// Employee API functions
export interface EmployeeApiResponse {
  success: boolean;
  message?: string;
  data: {
    employees: BackendEmployee[];
    employee: BackendEmployee;
    employeeCode?: string;
    token?: string;
  };
}

export const employeeApi = {
  // Get all employees
  getAll: async (params?: { search?: string; department?: string; status?: string }): Promise<EmployeeApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    return fetchApi<EmployeeApiResponse>(`/employees${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  // Get single employee
  getById: async (id: number): Promise<EmployeeApiResponse> => {
    return fetchApi<EmployeeApiResponse>(`/employees/${id}`, {
      method: 'GET',
    });
  },

  // Create new employee
  create: async (data: {
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    gender?: 'male' | 'female' | 'other';
    dateOfBirth?: string;
    joiningDate: string;
    department: string;
    role?: 'admin' | 'manager' | 'hr' | 'employee';
    status?: 'active' | 'inactive';
    mobile1: string;
    mobile2?: string;
    address?: string;
    bankAccountName?: string;
    bankAccountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    bankAddress?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    otherSocial?: string;
    password: string;
  }): Promise<EmployeeApiResponse> => {
    return fetchApi<EmployeeApiResponse>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update employee
  update: async (id: number, data: Partial<{
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth: string;
    joiningDate: string;
    department: string;
    role: 'admin' | 'manager' | 'hr' | 'employee';
    status: 'active' | 'inactive';
    mobile1: string;
    mobile2: string;
    address: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankName: string;
    ifscCode: string;
    bankAddress: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    otherSocial: string;
    password: string;
  }>): Promise<EmployeeApiResponse> => {
    return fetchApi<EmployeeApiResponse>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete employee
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(`/employees/${id}`, {
      method: 'DELETE',
    });
  },

  // Generate employee code
  generateCode: async (): Promise<EmployeeApiResponse> => {
    return fetchApi<EmployeeApiResponse>('/employees/code/generate', {
      method: 'GET',
    });
  },

  // Employee login
  login: async (mobile: string, password: string): Promise<EmployeeApiResponse> => {
    const response = await fetchApi<EmployeeApiResponse>('/employees/login', {
      method: 'POST',
      body: JSON.stringify({ mobile, password }),
    });
    
    // Store token on successful login
    if (response.data?.token) {
      setToken(response.data.token);
    }
    
    return response;
  },
};

// Attendance API functions
export interface AttendanceCheckoutPayload {
  employeeId: string;
  report: string;
}

export interface AttendanceResponse {
  success: boolean;
  message?: string;
  data?: {
    attendance: {
      id: number;
      employeeId: string;
      checkInTime: string;
      checkOutTime: string;
      totalTime: string;
      report: string;
      createdAt: string;
    };
    hasCheckedIn: boolean;
    hasCompletedToday: boolean;
  };
}

export interface AttendanceAllResponse {
  success: boolean;
  message?: string;
  data?: {
    attendance: {
      id: number;
      employee_id: string;
      date: string;
      check_in_time: string;
      check_out_time: string | null;
      total_time: string | null;
      report: string | null;
      created_at: string;
      first_name?: string;
      last_name?: string;
      department?: string;
    }[];
  };
}

// Attendance types
export interface AttendanceRecord {
  id: number | null;
  date: string;
  checkIn: string;
  checkOut: string;
  totalTime: string;
  status: 'Present' | 'Half Day' | 'Absent';
  report: string;
}

export interface EmployeeAttendanceResponse {
  success: boolean;
  data?: {
    employee: {
      id: number;
      name: string;
    };
    attendance: AttendanceRecord[];
  };
  message?: string;
}

export const attendanceApi = {
  // Get all attendance records (for admin/manager)
  getAll: async (params?: { date?: string; employeeId?: string; fromDate?: string; toDate?: string }): Promise<AttendanceAllResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.date) queryParams.append('date', params.date);
    if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
    if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params?.toDate) queryParams.append('toDate', params.toDate);
    
    const queryString = queryParams.toString();
    return fetchApi<AttendanceAllResponse>(`/attendance${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  // Get employee attendance by month and year
  getEmployeeAttendance: async (employeeId: number, month: number, year: number): Promise<EmployeeAttendanceResponse> => {
    return fetchApi<EmployeeAttendanceResponse>(`/attendance/employee/${employeeId}?month=${month}&year=${year}`, {
      method: 'GET',
    });
  },

  // Check in
  checkIn: async (data: { employeeId: string }): Promise<AttendanceResponse> => {
    return fetchApi<AttendanceResponse>('/attendance/checkin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Check out with report
  checkout: async (data: AttendanceCheckoutPayload): Promise<AttendanceResponse> => {
    return fetchApi<AttendanceResponse>('/attendance/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get today's attendance for current employee
  getTodayAttendance: async (explicitEmployeeId?: string): Promise<AttendanceResponse> => {
    const token = getToken();
    const employeeId = explicitEmployeeId || localStorage.getItem('employeeId');
    
    console.log('getTodayAttendance - token:', token ? 'exists' : 'none', 'employeeId:', employeeId);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    if (employeeId) {
      (headers as Record<string, string>)['x-employee-id'] = employeeId;
    }

    const response = await fetch(`${API_BASE_URL}/attendance/today`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    console.log('getTodayAttendance response:', response.status, data);

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  },
};

// Visit types
export interface VisitListItem {
  id: number;
  clientId: number;
  clientName: string;
  employeeId: number;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  location: string;
  remarks: string | null;
}

export interface VisitDetail {
  id: number;
  clientId: number;
  clientName: string;
  employeeId: number;
  employeeName: string;
  date: string;
  checkInTime: string;
  checkOutTime: string | null;
  location: string;
  remarks: string | null;
  purpose: string | null;
  outcome: string | null;
  nextFollowup: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VisitApiResponse {
  success: boolean;
  message?: string;
  data?: {
    visits?: VisitListItem[];
    visit?: VisitDetail;
  };
}

export interface ClientItem {
  id: number;
  name: string;
  companyName: string;
  email: string;
  mobile: string;
}

export interface EmployeeListItem {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  department: string;
  status: string;
}

export interface ClientsResponse {
  success: boolean;
  data?: {
    clients: ClientItem[];
  };
}

export interface EmployeesListResponse {
  success: boolean;
  data?: {
    employees: EmployeeListItem[];
  };
}

// Visits API functions
export const visitsApi = {
  // Get all visits with optional filters
  getAll: async (params?: { 
    startDate?: string; 
    endDate?: string; 
    employeeId?: string; 
    clientId?: string 
  }): Promise<VisitApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
    if (params?.clientId) queryParams.append('clientId', params.clientId);
    
    const queryString = queryParams.toString();
    return fetchApi<VisitApiResponse>(`/visits${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  // Get single visit by ID
  getById: async (id: number): Promise<VisitApiResponse> => {
    return fetchApi<VisitApiResponse>(`/visits/${id}`, {
      method: 'GET',
    });
  },

  // Create new visit
  create: async (data: {
    clientId: number;
    employeeId: number;
    date: string;
    checkInTime: string;
    checkOutTime?: string;
    location: string;
    remarks?: string;
    purpose?: string;
    outcome?: string;
    nextFollowup?: string;
  }): Promise<VisitApiResponse> => {
    return fetchApi<VisitApiResponse>('/visits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update visit
  update: async (id: number, data: Partial<{
    clientId: number;
    employeeId: number;
    date: string;
    checkInTime: string;
    checkOutTime: string;
    location: string;
    remarks: string;
    purpose: string;
    outcome: string;
    nextFollowup: string;
  }>): Promise<VisitApiResponse> => {
    return fetchApi<VisitApiResponse>(`/visits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete visit
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(`/visits/${id}`, {
      method: 'DELETE',
    });
  },

  // Get clients list for dropdown
  getClients: async (): Promise<ClientsResponse> => {
    return fetchApi<ClientsResponse>('/visits/clients/list', {
      method: 'GET',
    });
  },

  // Get employees list for dropdown
  getEmployees: async (): Promise<EmployeesListResponse> => {
    return fetchApi<EmployeesListResponse>('/visits/employees/list', {
      method: 'GET',
    });
  },
};

// Candidate types
export type CandidateStatus = 'Shortlisted' | 'Pending' | 'Interview Scheduled' | 'Applied' | 'Offer Sent' | 'Accepted Offer';

export interface Candidate {
  id: number;
  name: string;
  position: string;
  status: CandidateStatus;
  email: string;
  phone: string;
  resumeUrl: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateApiResponse {
  success: boolean;
  message?: string;
  data: {
    candidates?: Candidate[];
    candidate?: Candidate;
  };
}

// Candidate API functions
export const candidateApi = {
  // Get all candidates
  getAll: async (): Promise<CandidateApiResponse> => {
    return fetchApi<CandidateApiResponse>('/candidates', {
      method: 'GET',
    });
  },

  // Get single candidate by ID
  getById: async (id: number): Promise<CandidateApiResponse> => {
    return fetchApi<CandidateApiResponse>(`/candidates/${id}`, {
      method: 'GET',
    });
  },

  // Create new candidate
  create: async (data: {
    name: string;
    position: string;
    status?: CandidateStatus;
    email?: string;
    phone?: string;
    notes?: string;
  }): Promise<CandidateApiResponse> => {
    return fetchApi<CandidateApiResponse>('/candidates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update candidate
  update: async (id: number, data: Partial<{
    name: string;
    position: string;
    status: CandidateStatus;
    email: string;
    phone: string;
    notes: string;
  }>): Promise<CandidateApiResponse> => {
    return fetchApi<CandidateApiResponse>(`/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete candidate
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(`/candidates/${id}`, {
      method: 'DELETE',
    });
  },
};

// Job Post types
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
export type JobStatus = 'Active' | 'Closed';

export interface JobPost {
  id: number;
  title: string;
  date: string;
  type: JobType;
  location: string;
  experience: string;
  description: string;
  position: number;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface JobPostApiResponse {
  success: boolean;
  message?: string;
  data: {
    jobPosts?: JobPost[];
    jobPost?: JobPost;
  };
}

// Job Post API functions
export const jobPostApi = {
  // Get all job posts
  getAll: async (): Promise<JobPostApiResponse> => {
    return fetchApi<JobPostApiResponse>('/job-posts', {
      method: 'GET',
    });
  },

  // Get active job posts (for public listing)
  getActive: async (): Promise<JobPostApiResponse> => {
    return fetchApi<JobPostApiResponse>('/job-posts/active', {
      method: 'GET',
    });
  },

  // Get single job post by ID
  getById: async (id: number): Promise<JobPostApiResponse> => {
    return fetchApi<JobPostApiResponse>(`/job-posts/${id}`, {
      method: 'GET',
    });
  },

  // Create new job post
  create: async (data: {
    title: string;
    date: string;
    type: JobType;
    location: string;
    experience: string;
    description: string;
    position: number;
    status?: JobStatus;
  }): Promise<JobPostApiResponse> => {
    return fetchApi<JobPostApiResponse>('/job-posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update job post
  update: async (id: number, data: Partial<{
    title: string;
    date: string;
    type: JobType;
    location: string;
    experience: string;
    description: string;
    position: number;
    status: JobStatus;
  }>): Promise<JobPostApiResponse> => {
    return fetchApi<JobPostApiResponse>(`/job-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete job post
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(`/job-posts/${id}`, {
      method: 'DELETE',
    });
  },
};

// Job Application types
export type JobApplicationStatus = 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Rejected' | 'Hired';

export interface JobApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  name: string;
  email: string;
  mobile: string;
  education: string;
  address: string;
  resumeUrl: string;
  status: JobApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplicationApiResponse {
  success: boolean;
  message?: string;
  data: {
    jobApplications?: JobApplication[];
    jobApplication?: JobApplication;
  };
}

// Job Application API functions
export const jobApplicationApi = {
  // Get all job applications (requires auth)
  getAll: async (): Promise<JobApplicationApiResponse> => {
    return fetchApi<JobApplicationApiResponse>('/job-applications', {
      method: 'GET',
    });
  },

  // Get single job application by ID
  getById: async (id: number): Promise<JobApplicationApiResponse> => {
    return fetchApi<JobApplicationApiResponse>(`/job-applications/${id}`, {
      method: 'GET',
    });
  },

  // Submit job application (public)
  submit: async (data: {
    jobId: number;
    jobTitle: string;
    name: string;
    email: string;
    mobile: string;
    education: string;
    address: string;
  }): Promise<JobApplicationApiResponse> => {
    return fetchApi<JobApplicationApiResponse>('/job-applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update job application status
  updateStatus: async (id: number, status: string): Promise<JobApplicationApiResponse> => {
    return fetchApi<JobApplicationApiResponse>(`/job-applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Delete job application
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(`/job-applications/${id}`, {
      method: 'DELETE',
    });
  },
};

// Client types
export interface BackendClient {
  id: number;
  clientName: string;
  companyName: string;
  mobile: string;
  email: string | null;
  industry: string | null;
  address: string | null;
  profilePhoto: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Client API response types
interface ClientApiResponse {
  success: boolean;
  message?: string;
  data: {
    client: BackendClient;
    clients: BackendClient[];
    total: number;
  };
}

// Clients API functions
export const clientsApi = {
  // Get all clients with optional search
  getAll: async (params?: { search?: string }): Promise<ClientApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return fetchApi<ClientApiResponse>(`/clients${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  // Get single client by ID
  getById: async (id: number): Promise<ClientApiResponse> => {
    return fetchApi<ClientApiResponse>(`/clients/${id}`, {
      method: 'GET',
    });
  },

  // Create new client
  create: async (data: {
    clientName: string;
    companyName: string;
    mobile: string;
    email?: string;
    industry?: string;
    address?: string;
    profilePhoto?: string;
  }): Promise<ClientApiResponse> => {
    return fetchApi<ClientApiResponse>('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update client
  update: async (id: number, data: Partial<{
    clientName: string;
    companyName: string;
    mobile: string;
    email: string;
    industry: string;
    address: string;
    profilePhoto: string;
  }>): Promise<ClientApiResponse> => {
    return fetchApi<ClientApiResponse>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete client
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(`/clients/${id}`, {
      method: 'DELETE',
    });
  },

  // Toggle client active status
  toggleStatus: async (id: number): Promise<ClientApiResponse> => {
    return fetchApi<ClientApiResponse>(`/clients/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },
};

// Task types
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'in-progress' | 'pending' | 'completed';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  assigneeId: number;
  assigneeName: string;
  assignDate: string;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

// Task API response types
interface TaskApiResponse {
  success: boolean;
  message?: string;
  data: {
    tasks?: Task[];
    task?: Task;
    total?: number;
  };
}

// Task API functions
export const tasksApi = {
  // Get all tasks
  getAll: async (): Promise<TaskApiResponse> => {
    return fetchApi<TaskApiResponse>('/tasks', {
      method: 'GET',
    });
  },

  // Get single task by ID
  getById: async (id: number): Promise<TaskApiResponse> => {
    return fetchApi<TaskApiResponse>(`/tasks/${id}`, {
      method: 'GET',
    });
  },

  // Create new task
  create: async (data: {
    title: string;
    description?: string;
    priority: TaskPriority;
    assigneeId: number;
    dueDate: string;
    status?: TaskStatus;
  }): Promise<TaskApiResponse> => {
    return fetchApi<TaskApiResponse>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update task
  update: async (id: number, data: Partial<{
    title: string;
    description: string;
    priority: TaskPriority;
    assigneeId: number;
    dueDate: string;
    status: TaskStatus;
  }>): Promise<TaskApiResponse> => {
    return fetchApi<TaskApiResponse>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete task
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // Get employees for dropdown
  getEmployees: async (): Promise<EmployeesListResponse> => {
    return fetchApi<EmployeesListResponse>('/employees', {
      method: 'GET',
    });
  },
};

export default authApi;
