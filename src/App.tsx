import { Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/ui/LoginPage';
import RegisterPage from './features/auth/ui/RegisterPage';
import AppLayout from './app/layout/AppLayout';
import DashboardHome from './features/dashboard/ui/DashboardHome';
import FormPage from './features/example/ui/FormPage';
import TablePage from './features/example/ui/TablePage';
import GetDataPage from './features/example/ui/GetdataPage';
import RupDataPage from './features/rup-data/RupDataPage';
import { SampleCompletePage } from './features/sample-complete-api/SampleCompletePage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes inside layout */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardHome  />}/>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="form" element={<FormPage />} />
        <Route path="chart" element={<FormPage />} />
        <Route path="table" element={<TablePage />} />
        <Route path="rup" element={<GetDataPage />} />
        <Route path="rup-data" element={<RupDataPage />} />
        <Route path="products" element={<SampleCompletePage />} />
      </Route>
    </Routes>
  );
}

export default App;
