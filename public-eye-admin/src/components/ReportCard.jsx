import { Calendar, MapPin, User } from 'lucide-react';

const ReportCard = ({ report, onClick }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      resolved: 'bg-blue-100 text-blue-800 border-blue-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryName = (category) => {
    const names = {
      pothole: 'Pothole',
      street_light: 'Street Light',
      drainage: 'Drainage',
      garbage: 'Garbage',
      road_sign: 'Road Sign',
      other: 'Other'
    };
    return names[category] || category;
  };

  return (
    <div
      onClick={() => onClick(report)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={report.imageUrl}
          alt={report.category}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-900 text-sm truncate">
              {report.reportId}
            </h3>
            <p className="text-sm text-gray-600">{getCategoryName(report.category)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
            {report.status}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2">
          {/* Location */}
          {report.location && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1 font-mono text-xs">
                {report.location.latitude.toFixed(4)}, {report.location.longitude.toFixed(4)}
              </span>
            </div>
          )}
          
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(report.timestamp)}</span>
          </div>

          {/* Submitted By */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{report.userEmail}</span>
          </div>
        </div>

        {/* Description (if exists) */}
        {report.description && (
          <p className="text-sm text-gray-700 line-clamp-2 pt-2 border-t border-gray-100">
            {report.description}
          </p>
        )}

        {/* Confidence Score */}
        {report.aiConfidence !== undefined && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">AI Confidence</span>
              <span className={`font-semibold ${
                report.aiConfidence >= 0.7 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {(report.aiConfidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${
                  report.aiConfidence >= 0.7 ? 'bg-green-600' : 'bg-yellow-500'
                }`}
                style={{ width: `${report.aiConfidence * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCard;