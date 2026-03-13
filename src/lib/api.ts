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
    throw new Error(data.message || 'An error occurred');
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
  checkInTime: string;
  checkOutTime: string;
  totalTime: string;
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

export const attendanceApi = {
  // Get all attendance records (for admin/manager)
  getAll: async (params?: { date?: string; employeeId?: string }): Promise<AttendanceAllResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.date) queryParams.append('date', params.date);
    if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
    
    const queryString = queryParams.toString();
    return fetchApi<AttendanceAllResponse>(`/attendance${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
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
  getTodayAttendance: async (): Promise<AttendanceResponse> => {
    const token = getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Get employee ID from localStorage (stored during login)
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      (headers as Record<string, string>)['x-employee-id'] = employeeId;
    }

    const response = await fetch(`${API_BASE_URL}/attendance/today`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  },
};

export default authApi;
