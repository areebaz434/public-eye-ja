import { AlertCircle, CheckCircle, MapPin, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getLowConfidenceReports, updateReportStatus } from '../services/reportService';

const ReviewQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const result = await getLowConfidenceReports();
      if (result.success) {
        setQueue(result.reports);
      } else {
        console.error('Error loading review queue:', result.error);
      }
    } catch (error) {
      console.error('Error loading review queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (reportId, approved) => {
    setUpdating(true);
    try {
      const newStatus = approved ? 'approved' : 'rejected';
      const result = await updateReportStatus(reportId, newStatus);
      
      if (result.success) {
        // Remove from queue after successful update
        setQueue(queue.filter(r => r.id !== reportId));
      } else {
        alert(`Error updating report: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Failed to update report status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Review Queue</h1>
        </div>
        <p className="text-gray-600">
          Low-confidence AI classifications requiring manual review (&lt;70% confidence)
        </p>
      </div>

      {/* Queue Status */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-yellow-800 mb-1">Reports Awaiting Review</p>
            <p className="text-3xl font-bold text-yellow-900">{queue.length}</p>
          </div>
          {queue.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-yellow-700">Average Confidence</p>
              <p className="text-2xl font-bold text-yellow-900">
                {(queue.reduce((sum, r) => sum + (r.aiConfidence || 0), 0) / queue.length * 100).toFixed(0)}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Review Queue */}
      {queue.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            No reports requiring manual review at this time. All AI classifications have sufficient confidence scores.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {queue.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-2/5 lg:w-1/3">
                  <img
                    src={report.imageUrl}
                    alt={report.category}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 md:w-3/5 lg:w-2/3 flex flex-col justify-between">
                  <div>
                    {/* Warning Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-full flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-700" />
                        <span className="text-sm font-semibold text-yellow-800">
                          Low Confidence: {report.aiConfidence ? (report.aiConfidence * 100).toFixed(0) : 'N/A'}%
                        </span>
                      </div>
                    </div>

                    {/* Report Details */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {report.reportId}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">AI Suggested Category</p>
                          <p className="font-semibold text-gray-900 capitalize">
                            {report.category.replace('_', ' ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-semibold text-gray-900 font-mono text-sm">
                            {report.location?.latitude.toFixed(6)}, {report.location?.longitude.toFixed(6)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Submitted By</p>
                          <p className="font-semibold text-gray-900">{report.userEmail}</p>
                        </div>
                      </div>

                      {report.description && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Description</p>
                          <p className="text-gray-900">{report.description}</p>
                        </div>
                      )}

                      {/* AI Tags */}
                      {report.tags && report.tags.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">AI Detected Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {report.tags.map((tag, idx) => (
                              <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confidence Bar */}
                    {report.aiConfidence !== undefined && (
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">AI Confidence Score</span>
                          <span className="font-semibold text-yellow-700">
                            {(report.aiConfidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${report.aiConfidence * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleReview(report.id, true)}
                      disabled={updating}
                      className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve & Continue
                    </button>
                    <button
                      onClick={() => handleReview(report.id, false)}
                      disabled={updating}
                      className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;