import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons based on status
const getMarkerIcon = (status) => {
  const colors = {
    pending: '#eab308', // yellow
    'in-progress': '#3b82f6', // blue
    resolved: '#22c55e', // green
    rejected: '#ef4444' // red
  };

  const color = colors[status] || '#6b7280';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
          color: white;
          font-size: 16px;
          font-weight: bold;
        ">!</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Component to fit map bounds to markers
const FitBounds = ({ reports }) => {
  const map = useMap();

  useEffect(() => {
    if (reports.length > 0) {
      const bounds = reports.map(r => r.coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [reports, map]);

  return null;
};

const MapView = ({ reports, onReportClick, selectedReport }) => {
  // Default center: Kingston, Jamaica
  const defaultCenter = [18.0179, -76.8099];

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="h-full w-full rounded-lg"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {reports.length > 0 && <FitBounds reports={reports} />}
        
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={report.coordinates}
            icon={getMarkerIcon(report.status)}
            eventHandlers={{
              click: () => onReportClick && onReportClick(report)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-gray-900 mb-2">{report.id}</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Category:</span> {report.category}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Location:</span> {report.location}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Status:</span>{' '}
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${report.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
                      ${report.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                      ${report.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {report.status.replace('-', ' ')}
                    </span>
                  </p>
                </div>
                {report.image && (
                  <img
                    src={report.image}
                    alt="Report"
                    className="w-full h-32 object-cover rounded mt-2"
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Status Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Resolved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;