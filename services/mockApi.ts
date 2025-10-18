// ============================================
// services/mockApi.ts - Mock API Service
// ============================================
import type { Report, ReportCategory, ReportStatus } from '../types';

// Mock Images from Unsplash
const MOCK_IMAGES = {
  pothole: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400',
  street_light: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400',
  drainage: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',
  road_damage: 'https://images.unsplash.com/photo-1449224864661-655a1f57bcc5?w=400',
  traffic_signal: 'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=400',
  other: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400',
};

// Kingston, Jamaica coordinates
const KINGSTON_COORDINATES = [
  { lat: 18.0179, lng: -76.8099 },
  { lat: 18.0089, lng: -76.7964 },
  { lat: 17.9970, lng: -76.7936 },
  { lat: 18.0256, lng: -76.8194 },
  { lat: 18.0034, lng: -76.7858 },
  { lat: 17.9881, lng: -76.8003 },
  { lat: 18.0145, lng: -76.8256 },
  { lat: 17.9945, lng: -76.7789 },
];

const CATEGORIES: ReportCategory[] = [
  'pothole',
  'street_light',
  'drainage',
  'road_damage',
  'traffic_signal',
  'other'
];

const STATUSES: ReportStatus[] = [
  'pending',
  'in_review',
  'approved',
  'in_progress',
  'resolved'
];

// Helper functions
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
}

// Generate mock reports
function generateMockReports(count: number = 50): Report[] {
  const reports: Report[] = [];
  
  for (let i = 0; i < count; i++) {
    const category = randomElement(CATEGORIES);
    const status = randomElement(STATUSES);
    const coords = randomElement(KINGSTON_COORDINATES);
    const createdAt = randomDate(30);
    
    reports.push({
      id: `report-${i + 1}`,
      userId: i % 5 === 0 ? 'mock-user-123' : `user-${i}`,
      category,
      imageUrl: MOCK_IMAGES[category],
      location: {
        latitude: coords.lat + (Math.random() - 0.5) * 0.02,
        longitude: coords.lng + (Math.random() - 0.5) * 0.02,
        address: `${Math.floor(Math.random() * 200)} Main Street, Kingston`,
      },
      status,
      confidence: 0.5 + Math.random() * 0.5,
      description: `Report for ${category.replace('_', ' ')} issue in the area`,
      createdAt,
      updatedAt: createdAt,
      priorityLevel: randomElement(['low', 'medium', 'high', 'critical'] as const),
      viewCount: Math.floor(Math.random() * 100),
      upvotes: Math.floor(Math.random() * 50),
    });
  }
  
  return reports.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// In-memory data store
let MOCK_REPORTS = generateMockReports(50);

// ============================================
// Mock Reports Service
// ============================================
export const MockReportsService = {
  /**
   * Create a new report
   * Simulates API call to Flask backend
   */
  async createReport(data: {
    imageUri: string;
    location: { latitude: number; longitude: number };
    category: ReportCategory;
    description?: string;
  }): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate random failure (10% chance)
    if (Math.random() > 0.9) {
      throw new Error('Network error: Failed to submit report');
    }
    
    const newReport: Report = {
      id: `report-${Date.now()}`,
      userId: 'mock-user-123',
      category: data.category,
      imageUrl: data.imageUri, // In real app, this would be URL from server
      location: {
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        address: 'Kingston, Jamaica',
      },
      status: 'approved',
      confidence: 0.85,
      description: data.description || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      upvotes: 0,
    };
    
    MOCK_REPORTS.unshift(newReport);
    return newReport.id;
  },

  /**
   * Get all approved reports for public map view
   */
  async getApprovedReports(): Promise<Report[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return MOCK_REPORTS.filter(r => 
      ['approved', 'in_progress', 'resolved'].includes(r.status)
    );
  },

  /**
   * Get reports by specific user
   */
  async getUserReports(userId: string): Promise<Report[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return MOCK_REPORTS.filter(r => r.userId === userId);
  },

  /**
   * Get single report by ID
   */
  async getReport(reportId: string): Promise<Report | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return MOCK_REPORTS.find(r => r.id === reportId) || null;
  },

  /**
   * Get reports by category
   */
  async getReportsByCategory(category: ReportCategory): Promise<Report[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return MOCK_REPORTS.filter(r => 
      r.category === category && 
      ['approved', 'in_progress', 'resolved'].includes(r.status)
    );
  },

  /**
   * Get reports by status
   */
  async getReportsByStatus(status: ReportStatus): Promise<Report[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return MOCK_REPORTS.filter(r => r.status === status);
  }
};

// ============================================
// Mock Admin Service
// ============================================
export const MockAdminService = {
  /**
   * Get all reports with optional filters (admin only)
   */
  async getAllReports(filters?: {
    status?: ReportStatus;
    category?: ReportCategory;
  }): Promise<Report[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filtered = [...MOCK_REPORTS];
    
    if (filters?.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters?.category) {
      filtered = filtered.filter(r => r.category === filters.category);
    }
    
    return filtered;
  },

  /**
   * Get reports needing review (low confidence)
   */
  async getReviewQueue(): Promise<Report[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return MOCK_REPORTS.filter(r => 
      r.status === 'in_review' && r.confidence < 0.7
    );
  },

  /**
   * Update report status (admin only)
   */
  async updateReportStatus(
    reportId: string,
    status: ReportStatus,
    adminNotes?: string,
    priorityLevel?: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const report = MOCK_REPORTS.find(r => r.id === reportId);
    if (report) {
      report.status = status;
      report.updatedAt = new Date();
      if (adminNotes) report.adminNotes = adminNotes;
      if (priorityLevel) report.priorityLevel = priorityLevel;
      if (status === 'resolved') report.resolvedAt = new Date();
    }
  },

  /**
   * Get analytics data
   */
  async getAnalytics(): Promise<{
    totalReports: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
    avgResolutionTime: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const byStatus: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    let totalResolutionTime = 0;
    let resolvedCount = 0;

    MOCK_REPORTS.forEach(report => {
      // Count by status
      byStatus[report.status] = (byStatus[report.status] || 0) + 1;
      
      // Count by category
      byCategory[report.category] = (byCategory[report.category] || 0) + 1;

      // Calculate resolution time
      if (report.status === 'resolved' && report.resolvedAt && report.createdAt) {
        const resolutionTime = 
          (report.resolvedAt.getTime() - report.createdAt.getTime()) / 
          (1000 * 60 * 60 * 24); // Convert to days
        totalResolutionTime += resolutionTime;
        resolvedCount++;
      }
    });

    return {
      totalReports: MOCK_REPORTS.length,
      byStatus,
      byCategory,
      avgResolutionTime: resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0,
    };
  },

  /**
   * Bulk update reports (admin only)
   */
  async bulkUpdateStatus(
    reportIds: string[],
    status: ReportStatus,
    adminNotes?: string
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    reportIds.forEach(id => {
      const report = MOCK_REPORTS.find(r => r.id === id);
      if (report) {
        report.status = status;
        report.updatedAt = new Date();
        if (adminNotes) report.adminNotes = adminNotes;
      }
    });
  }
};

// Export for easy access to mock data
export const getMockReports = () => MOCK_REPORTS;
export const resetMockReports = () => {
  MOCK_REPORTS = generateMockReports(50);
};