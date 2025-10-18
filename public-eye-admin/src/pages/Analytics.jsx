import { BarChart3, Clock, Download, MapPin, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/api';

// Add Error Boundary Component
class AnalyticsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Analytics Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
            <p className="text-red-600 mb-4">Failed to load analytics dashboard</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Safe data access functions
  const getTotalReports = () => analytics?.totalReports || 0;
  const getPendingReports = () => analytics?.pendingReports || 0;
  const getResolvedReports = () => analytics?.resolvedReports || 0;
  const getInProgressReports = () => analytics?.inProgressReports || 0;
  const getRejectedReports = () => analytics?.rejectedReports || 0;
  const getAvgResolutionTime = () => analytics?.avgResolutionTime || '0 days';
  
  const getCategoryBreakdown = () => {
    if (!analytics?.categoryBreakdown || !Array.isArray(analytics.categoryBreakdown)) {
      return [];
    }
    return analytics.categoryBreakdown;
  };
  
  const getMonthlyTrend = () => {
    if (!analytics?.monthlyTrend || !Array.isArray(analytics.monthlyTrend)) {
      return [];
    }
    return analytics.monthlyTrend;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Analytics</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
          <p className="text-gray-500 mb-4">Analytics data will appear here once reports are submitted.</p>
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  // Calculate safe values with fallbacks
  const totalReports = getTotalReports();
  const pendingReports = getPendingReports();
  const resolvedReports = getResolvedReports();
  const inProgressReports = getInProgressReports();
  const rejectedReports = getRejectedReports();
  const categoryBreakdown = getCategoryBreakdown();
  const monthlyTrend = getMonthlyTrend();

  const maxCategoryCount = categoryBreakdown.length > 0 
    ? Math.max(...categoryBreakdown.map(c => c.count || 0))
    : 0;
    
  const maxMonthlyReports = monthlyTrend.length > 0
    ? Math.max(...monthlyTrend.map(m => m.reports || 0))
    : 0;

  const resolutionRate = totalReports > 0 ? (resolvedReports / totalReports) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor report statistics, trends, and performance metrics
          </p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-md"
          onClick={loadAnalytics}
        >
          <Download className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Reports */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total Reports</p>
          <p className="text-3xl font-bold">{totalReports.toLocaleString()}</p>
        </div>

        {/* Pending Reports */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-sm opacity-90">Active</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Pending Review</p>
          <p className="text-3xl font-bold">{pendingReports.toLocaleString()}</p>
        </div>

        {/* Resolved Reports */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-sm opacity-90 mb-1">Resolved</p>
          <p className="text-3xl font-bold">{resolvedReports.toLocaleString()}</p>
          <p className="text-xs opacity-80 mt-2">
            {resolutionRate.toFixed(1)}% of total
          </p>
        </div>

        {/* Average Resolution Time */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <TrendingDown className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-sm opacity-90 mb-1">Avg Resolution</p>
          <p className="text-3xl font-bold">{getAvgResolutionTime()}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Reports by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Reports by Category</h2>
            <span className="text-sm text-gray-500">Total: {totalReports}</span>
          </div>
          
          <div className="space-y-4">
            {categoryBreakdown.length > 0 ? (
              categoryBreakdown.map((item, index) => {
                const percentage = totalReports > 0 ? (item.count / totalReports * 100).toFixed(1) : 0;
                const barWidth = maxCategoryCount > 0 ? (item.count / maxCategoryCount * 100) : 0;
                
                const colors = [
                  'bg-blue-500',
                  'bg-green-500',
                  'bg-yellow-500',
                  'bg-purple-500',
                  'bg-pink-500'
                ];

                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {item.category || 'Uncategorized'}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{percentage}%</span>
                        <span className="text-sm font-bold text-gray-900">{item.count || 0}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-700 ${colors[index % colors.length]}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                No category data available
              </div>
            )}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Monthly Trend</h2>
            <span className="text-sm text-gray-500">Last {monthlyTrend.length} months</span>
          </div>

          {monthlyTrend.length > 0 ? (
            <>
              <div className="h-64 flex items-end justify-between gap-2">
                {monthlyTrend.map((item, index) => {
                  const height = maxMonthlyReports > 0 ? (item.reports / maxMonthlyReports * 100) : 0;
                  const isLatest = index === monthlyTrend.length - 1;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full flex flex-col items-center">
                        <span className="text-xs font-semibold text-gray-700 mb-1">
                          {item.reports || 0}
                        </span>
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-700 ${
                            isLatest ? 'bg-green-500' : 'bg-blue-500'
                          } hover:bg-green-600 cursor-pointer`}
                          style={{ height: `${Math.max(height, 5)}%` }}
                          title={`${item.month}: ${item.reports || 0} reports`}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {item.month || `Month ${index + 1}`}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Previous Months</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Current Month</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No trend data available
            </div>
          )}
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Report Status Overview</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">{pendingReports}</p>
            <p className="text-xs text-yellow-700 mt-1">
              {totalReports > 0 ? ((pendingReports / totalReports) * 100).toFixed(1) : 0}% of total
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{inProgressReports}</p>
            <p className="text-xs text-blue-700 mt-1">
              {totalReports > 0 ? ((inProgressReports / totalReports) * 100).toFixed(1) : 0}% of total
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Resolved</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{resolvedReports}</p>
            <p className="text-xs text-green-700 mt-1">
              {totalReports > 0 ? ((resolvedReports / totalReports) * 100).toFixed(1) : 0}% of total
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Rejected</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{rejectedReports}</p>
            <p className="text-xs text-red-700 mt-1">
              {totalReports > 0 ? ((rejectedReports / totalReports) * 100).toFixed(1) : 0}% of total
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap the component with error boundary
export default function AnalyticsWithErrorBoundary() {
  return (
    <AnalyticsErrorBoundary>
      <Analytics />
    </AnalyticsErrorBoundary>
  );
}