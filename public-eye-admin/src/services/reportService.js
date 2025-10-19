import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';


/**
 * Get all reports (admin view)
 */
export const getAllReports = async (filters = {}) => {
  try {
    let q = collection(db, 'reports');
    
    // Apply filters
    const constraints = [];
    
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    
    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    
    // Order by newest first
    constraints.push(orderBy('timestamp', 'desc'));
    
    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }
    
    const snapshot = await getDocs(q);
    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, reports };
  } catch (error) {
    console.error('Error fetching reports:', error);
    return { success: false, error: error.message, reports: [] };
  }
};

/**
 * Get reports pending review
 */
export const getPendingReports = async () => {
  try {
    const q = query(
      collection(db, 'reports'),
      where('status', '==', 'pending'),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, reports };
  } catch (error) {
    console.error('Error fetching pending reports:', error);
    return { success: false, error: error.message, reports: [] };
  }
};

/**
 * Get low confidence reports (for review)
 */
export const getLowConfidenceReports = async () => {
  try {
    const allReportsResult = await getAllReports();
    
    if (!allReportsResult.success) {
      return allReportsResult;
    }
    
    // Filter reports with AI confidence < 0.7
    const lowConfidenceReports = allReportsResult.reports.filter(
      report => report.aiConfidence < 0.7
    );
    
    return { success: true, reports: lowConfidenceReports };
  } catch (error) {
    console.error('Error fetching low confidence reports:', error);
    return { success: false, error: error.message, reports: [] };
  }
};

/**
 * Get single report by ID
 */
export const getReportById = async (reportId) => {
  try {
    const docRef = doc(db, 'reports', reportId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { success: false, error: 'Report not found' };
    }
    
    return { 
      success: true, 
      report: { id: docSnap.id, ...docSnap.data() } 
    };
  } catch (error) {
    console.error('Error fetching report:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update report status (admin action)
 */
export const updateReportStatus = async (reportId, newStatus, adminNotes = '') => {
  try {
    const docRef = doc(db, 'reports', reportId);
    
    const updateData = {
      status: newStatus,
      updatedAt: Timestamp.now()
    };
    
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    
    await updateDoc(docRef, updateData);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating report status:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get analytics data
 */
export const getAnalytics = async () => {
  try {
    const result = await getAllReports();
    
    if (!result.success) {
      return result;
    }
    
    const reports = result.reports;
    
    // Calculate stats
    const analytics = {
      total: reports.length,
      pending: reports.filter(r => r.status === 'pending').length,
      approved: reports.filter(r => r.status === 'approved').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
      rejected: reports.filter(r => r.status === 'rejected').length,
      
      // By category
      byCategory: {
        pothole: reports.filter(r => r.category === 'pothole').length,
        street_light: reports.filter(r => r.category === 'street_light').length,
        drainage: reports.filter(r => r.category === 'drainage').length,
        garbage: reports.filter(r => r.category === 'garbage').length,
        road_sign: reports.filter(r => r.category === 'road_sign').length,
        other: reports.filter(r => r.category === 'other').length,
      },
      
      // This week
      thisWeek: reports.filter(r => {
        const reportDate = new Date(r.timestamp);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return reportDate >= weekAgo;
      }).length,
      
      // Average confidence
      avgConfidence: reports.reduce((acc, r) => acc + (r.aiConfidence || 0), 0) / reports.length,
    };
    
    return { success: true, analytics };
  } catch (error) {
    console.error('Error calculating analytics:', error);
    return { success: false, error: error.message };
  }
};