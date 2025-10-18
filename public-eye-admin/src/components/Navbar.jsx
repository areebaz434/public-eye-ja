import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any auth tokens here
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Public Eye JA" 
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  // Fallback if logo not found
                  e.target.style.display = 'none';
                }}
              />
              <h1 className="text-xl font-bold">
                public<span className="text-green-600">eye</span>
                <span className="text-yellow-500 text-lg">JM</span>
              </h1>
            </div>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Government Official</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;