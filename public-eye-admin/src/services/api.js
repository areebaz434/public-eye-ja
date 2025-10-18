// Mock API Service - Replace with actual API calls later

const mockReports = [
  {
    id: "RPT-001",
    category: "Pothole",
    status: "pending",
    location: "Half Way Tree, Kingston",
    coordinates: [18.0179, -76.7965],
    submittedBy: "John Doe",
    submittedAt: "2025-10-15T10:30:00",
    confidence: 0.92,
    image: "https://images.unsplash.com/photo-1610720492920-0a1e0e7c4898?w=400",
    description: "Large pothole causing traffic issues",
  },
  {
    id: "RPT-002",
    category: "Broken Street Light",
    status: "in-progress",
    location: "Spanish Town Road, Kingston",
    coordinates: [17.9927, -76.8334],
    submittedBy: "Jane Smith",
    submittedAt: "2025-10-14T15:45:00",
    confidence: 0.88,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    description: "Street light not functioning at night",
  },
  {
    id: "RPT-003",
    category: "Clogged Drain",
    status: "resolved",
    location: "Constant Spring Road, Kingston",
    coordinates: [18.0296, -76.7963],
    submittedBy: "Bob Johnson",
    submittedAt: "2025-10-13T09:15:00",
    confidence: 0.65,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    description: "Drain blocked causing flooding",
  },
  {
    id: "RPT-004",
    category: "Pothole",
    status: "pending",
    location: "Hope Road, Kingston",
    coordinates: [18.0106, -76.7742],
    submittedBy: "Sarah Williams",
    submittedAt: "2025-10-16T11:20:00",
    confidence: 0.95,
    image: "https://images.unsplash.com/photo-1610720492920-0a1e0e7c4898?w=400",
    description: "Multiple potholes on main road",
  },
  {
    id: "RPT-005",
    category: "Broken Street Light",
    status: "rejected",
    location: "Mandela Highway, Kingston",
    coordinates: [17.9714, -76.8206],
    submittedBy: "Mike Brown",
    submittedAt: "2025-10-12T14:30:00",
    confidence: 0.45,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    description: "Damaged light post",
  },
  {
    id: "RPT-006",
    category: "Damaged Road Sign",
    status: "pending",
    location: "Barbican Road, Kingston",
    coordinates: [18.0234, -76.7886],
    submittedBy: "Lisa Davis",
    submittedAt: "2025-10-16T14:00:00",
    confidence: 0.78,
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
    description: "Stop sign knocked over",
  },
];

const api = {
  // Get all reports with optional filters
  getReports: async (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockReports];

        if (filters.status && filters.status !== "all") {
          filtered = filtered.filter((r) => r.status === filters.status);
        }

        if (filters.category && filters.category !== "all") {
          filtered = filtered.filter((r) => r.category === filters.category);
        }

        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(
            (r) =>
              r.id.toLowerCase().includes(search) ||
              r.location.toLowerCase().includes(search)
          );
        }

        resolve(filtered);
      }, 300);
    });
  },

  // Get analytics data
  getAnalytics: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalReports: 1247,
          pendingReports: 234,
          inProgressReports: 156,
          resolvedReports: 789,
          rejectedReports: 68,
          avgResolutionTime: "4.2 days",
          categoryBreakdown: [
            { category: "Pothole", count: 542 },
            { category: "Broken Street Light", count: 298 },
            { category: "Clogged Drain", count: 187 },
            { category: "Damaged Road Sign", count: 134 },
            { category: "Other", count: 86 },
          ],
        });
      }, 300);
    });
  },

  // Get low-confidence reports for review
  getReviewQueue: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockReports.filter((r) => r.confidence < 0.7));
      }, 300);
    });
  },

  // Update report status
  updateReportStatus: async (reportId, newStatus, notes = "") => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = mockReports.find((r) => r.id === reportId);
        if (report) {
          report.status = newStatus;
        }
        resolve({ success: true, reportId, newStatus });
      }, 500);
    });
  },

  // Login (mock)
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          resolve({
            success: true,
            user: {
              name: "Admin User",
              email: email,
              role: "admin",
            },
            token: "mock-jwt-token",
          });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 500);
    });
  },
};

export default api;
