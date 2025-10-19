import { BarChart3 } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor report statistics, trends, and performance metrics
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Coming Soon</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Advanced analytics and reporting features are currently under development. 
            Check back soon for insights into report trends, resolution times, and more.
          </p>
        </div>
      </div>

      {/* Placeholder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 font-medium">Report Statistics</p>
        </div>
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 font-medium">Trend Analysis</p>
        </div>
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 font-medium">Performance Metrics</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;