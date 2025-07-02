import { Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/ui/LoginPage';
import RegisterPage from './features/auth/ui/RegisterPage';
import AppLayout from './app/layout/AppLayout';
import DashboardHome from './features/dashboard/ui/DashboardHome';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes inside layout */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardHome  />}/>
        <Route path="dashboard" element={<DashboardHome />} />
      </Route>
    </Routes>
  );
}

export default App;
