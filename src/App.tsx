import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/ui/LoginPage';
import RegisterPage from './features/auth/ui/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<div className="p-4">Welcome Home!</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
