import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Reports from './pages/Reports';
import ReviewQueue from './pages/ReviewQueue';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Check if user is authenticated (simplified - replace with actual auth logic)
  const isAuthenticated = () => {
    return localStorage.getItem('authToken') !== null;
  };

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes with Layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                  <main className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/review" element={<ReviewQueue />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;