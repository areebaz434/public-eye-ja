// ============================================
// types/index.ts - Complete Type Definitions
// ============================================

export interface Report {
  id: string;
  userId: string;
  category: ReportCategory;
  imageUrl: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    parish?: string;
  };
  status: ReportStatus;
  confidence: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  priorityLevel?: 'low' | 'medium' | 'high' | 'critical';
  adminNotes?: string;
  aiTags?: string[];
  viewCount?: number;
  upvotes?: number;
}

export type ReportCategory = 
  | 'pothole'
  | 'street_light'
  | 'drainage'
  | 'road_damage'
  | 'traffic_signal'
  | 'other';

export type ReportStatus = 
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'citizen' | 'admin';
  createdAt: Date;
  reportCount?: number;
  lastActive?: Date;
}

export interface Analytics {
  totalReports: number;
  byStatus: Record<ReportStatus, number>;
  byCategory: Record<ReportCategory, number>;
  avgResolutionTime: number;
  resolutionRate?: number;
}

export interface CreateReportRequest {
  imageUri: string;
  location: {
    latitude: number;
    longitude: number;
  };
  category: ReportCategory;
  description?: string;
}

export interface UpdateReportRequest {
  status: ReportStatus;
  adminNotes?: string;
  priorityLevel?: 'low' | 'medium' | 'high' | 'critical';
}

// API Response types (for when connecting to Flask)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateReportResponse {
  reportId: string;
  category: ReportCategory;
  confidence: number;
  status: ReportStatus;
}