import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import DataUploadPage from './pages/DataUploadPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './contexts/AuthContext';

// Check login
function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<DashboardLayout />}>
            <Route path='dashboard' element={<DashboardPage />} />
            <Route path='analytics' element={<AnalyticsPage />} />
            <Route path='reports' element={<ReportsPage />} />
            <Route path='data-upload' element={<DataUploadPage />} />
            <Route path='profile' element={<ProfilePage />} />
            <Route path='settings' element={<SettingsPage />} />
            <Route path='about' element={<AboutPage />} />
            <Route path='help' element={<HelpPage />} />
          </Route>
        </Route>

        {/* Error page */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;