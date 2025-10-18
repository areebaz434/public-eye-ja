import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import MapView from '../components/MapView';
import api from '../services/api';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, reports]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports();
      setReports(data);
      setFilteredReports(data);
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
        r.id.toLowerCase().includes(search) ||
        r.location.toLowerCase().includes(search)
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

  const getStatusStats = () => {
    const stats = {
      all: reports.length,
      pending: reports.filter(r => r.status === 'pending').length,
      'in-progress': reports.filter(r => r.status === 'in-progress').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
      rejected: reports.filter(r => r.status === 'rejected').length
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header with Stats */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Map Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredReports.length} of {reports.length} reports
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-700 font-medium">Pending</p>
              <p className="text-xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 font-medium">In Progress</p>
              <p className="text-xl font-bold text-blue-900">{stats['in-progress']}</p>
            </div>
            <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-700 font-medium">Resolved</p>
              <p className="text-xl font-bold text-green-900">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID or location..."
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
            <option value="in-progress">In Progress</option>
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
            <option value="Pothole">Pothole</option>
            <option value="Broken Street Light">Broken Street Light</option>
            <option value="Clogged Drain">Clogged Drain</option>
            <option value="Damaged Road Sign">Damaged Road Sign</option>
          </select>

          {/* Clear Filters */}
          {(filters.status !== 'all' || filters.category !== 'all' || filters.search) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* THE BIG MAP */}
      <div className="flex-1 relative">
        <MapView
          reports={filteredReports}
          onReportClick={setSelectedReport}
          selectedReport={selectedReport}
        />
      </div>

      {/* Report Detail Sidebar */}
      {selectedReport && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Image */}
              <img
                src={selectedReport.image}
                alt="Report"
                className="w-full h-64 object-cover rounded-lg"
              />

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Report ID</p>
                  <p className="font-semibold text-gray-900">{selectedReport.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                    ${selectedReport.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${selectedReport.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
                    ${selectedReport.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                    ${selectedReport.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {selectedReport.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold text-gray-900">{selectedReport.category}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">{selectedReport.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted By</p>
                  <p className="font-semibold text-gray-900">{selectedReport.submittedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">AI Confidence</p>
                  <p className="font-semibold text-gray-900">
                    {(selectedReport.confidence * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Submitted At</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedReport.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedReport.description && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-900">{selectedReport.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium">
                    In Progress
                  </button>
                  <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium">
                    Resolve
                  </button>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium">
                    Reject
                  </button>
                  <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium">
                    View Full
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;