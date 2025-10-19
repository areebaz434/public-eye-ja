import { Calendar, CheckCircle, Clock, Filter, MapPin, Search, User, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReportCard from '../components/ReportCard';
import { getAllReports, updateReportStatus } from '../services/reportService';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, reports]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const result = await getAllReports();
      if (result.success) {
        setReports(result.reports);
        setFilteredReports(result.reports);
      } else {
        console.error('Error loading reports:', result.error);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reports];

    if (filters.status !== 'all') {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(r => r.category === filters.category);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(r =>
        r.reportId?.toLowerCase().includes(search) ||
        r.id?.toLowerCase().includes(search) ||
        r.userEmail?.toLowerCase().includes(search) ||
        r.description?.toLowerCase().includes(search)
      );
    }

    setFilteredReports(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: 'all', category: 'all', search: '' });
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    if (!confirm(`Change status to "${newStatus}"?`)) return;

    setUpdating(true);
    try {
      const result = await updateReportStatus(reportId, newStatus);
      if (result.success) {
        // Update local state
        setReports(reports.map(r => 
          r.id === reportId ? { ...r, status: newStatus } : r
        ));
        setSelectedReport(prev => 
          prev && prev.id === reportId ? { ...prev, status: newStatus } : prev
        );
      } else {
        alert(`Error updating status: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Reports</h1>
        <p className="text-gray-600 mt-2">
          Manage and review all citizen-submitted infrastructure reports
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID, email, or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            <option value="all">All Categories</option>
            <option value="pothole">Pothole</option>
            <option value="street_light">Street Light</option>
            <option value="drainage">Drainage</option>
            <option value="garbage">Garbage</option>
            <option value="road_sign">Road Sign</option>
            <option value="other">Other</option>
          </select>

          {/* Clear Filters */}
          {(filters.status !== 'all' || filters.category !== 'all' || filters.search) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredReports.length}</span> of{' '}
          <span className="font-semibold">{reports.length}</span> reports
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more results</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={setSelectedReport}
            />
          ))}
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Report Details</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Image */}
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={selectedReport.imageUrl}
                    alt="Report"
                    className="w-full h-80 object-cover"
                  />
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold
                    ${selectedReport.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${selectedReport.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                    ${selectedReport.status === 'resolved' ? 'bg-blue-100 text-blue-800' : ''}
                    ${selectedReport.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {selectedReport.status.toUpperCase()}
                  </span>
                  {selectedReport.aiConfidence && (
                    <span className={`text-sm font-medium ${
                      selectedReport.aiConfidence >= 0.7 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {(selectedReport.aiConfidence * 100).toFixed(0)}% AI Confidence
                    </span>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Report ID</p>
                      <p className="text-sm font-semibold text-gray-900 font-mono">
                        {selectedReport.reportId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Category</p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">
                        {selectedReport.category.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location
                      </p>
                      <p className="text-gray-900 text-sm font-mono">
                        {selectedReport.location?.latitude.toFixed(6)}, {selectedReport.location?.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <User className="w-4 h-4 inline mr-1" />
                        Submitted By
                      </p>
                      <p className="text-gray-900">{selectedReport.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Submitted At
                      </p>
                      <p className="text-gray-900">
                        {selectedReport.timestamp ? new Date(selectedReport.timestamp).toLocaleString('en-US', {
                          dateStyle: 'long',
                          timeStyle: 'short'
                        }) : 'N/A'}
                      </p>
                    </div>
                    {selectedReport.updatedAt && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                        <p className="text-gray-900 text-sm">
                          {new Date(selectedReport.updatedAt.toDate()).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {selectedReport.description && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                      {selectedReport.description}
                    </p>
                  </div>
                )}

                {/* AI Tags */}
                {selectedReport.tags && selectedReport.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">AI Detected Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {selectedReport.adminNotes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Admin Notes</p>
                    <p className="text-gray-900 bg-blue-50 p-4 rounded-lg">
                      {selectedReport.adminNotes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-4">Update Status</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => handleStatusUpdate(selectedReport.id, 'pending')}
                      disabled={updating || selectedReport.status === 'pending'}
                      className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Clock className="w-4 h-4" />
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedReport.id, 'approved')}
                      disabled={updating || selectedReport.status === 'approved'}
                      className="px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedReport.id, 'resolved')}
                      disabled={updating || selectedReport.status === 'resolved'}
                      className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Resolved
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedReport.id, 'rejected')}
                      disabled={updating || selectedReport.status === 'rejected'}
                      className="px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;