import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReportById, updateReportStatus } from '../services/reportService';

const CATEGORY_NAMES = {
  pothole: 'Pothole',
  street_light: 'Street Light',
  drainage: 'Drainage',
  garbage: 'Garbage',
  road_sign: 'Road Sign',
  other: 'Other',
};

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    const result = await getReportById(id);
    if (result.success) {
      setReport(result.report);
      setAdminNotes(result.report.adminNotes || '');
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!confirm(`Change status to "${newStatus}"?`)) return;

    setUpdating(true);
    const result = await updateReportStatus(id, newStatus, adminNotes);
    setUpdating(false);

    if (result.success) {
      alert('Status updated successfully!');
      loadReport();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (loading) {
    return <div className="p-6">Loading report...</div>;
  }

  if (!report) {
    return <div className="p-6">Report not found</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-green-600 hover:text-green-700 font-semibold"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <img
            src={report.imageUrl}
            alt={report.category}
            className="w-full rounded-lg shadow-lg"
          />
          
          {/* Tags */}
          {report.tags && report.tags.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">AI Detected Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {report.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold mb-4">
              {CATEGORY_NAMES[report.category]}
            </h1>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Status</label>
                <p className="text-lg capitalize">{report.status}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Report ID</label>
                <p className="text-sm font-mono">{report.reportId}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Submitted By</label>
                <p>{report.userEmail}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Date</label>
                <p>{new Date(report.timestamp).toLocaleString()}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Location</label>
                <p className="font-mono text-sm">
                  {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
                </p>
              </div>

              {report.aiConfidence && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">AI Confidence</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{ width: `${report.aiConfidence * 100}%` }}
                      />
                    </div>
                    <span className="font-bold">{(report.aiConfidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}

              {report.description && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Description</label>
                  <p className="text-gray-700">{report.description}</p>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <label className="text-sm font-semibold text-gray-600">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Add internal notes..."
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t">
                <label className="text-sm font-semibold text-gray-600 block mb-3">
                  Change Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={updating || report.status === 'approved'}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={updating || report.status === 'rejected'}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('pending')}
                    disabled={updating || report.status === 'pending'}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg disabled:opacity-50"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('resolved')}
                    disabled={updating || report.status === 'resolved'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}