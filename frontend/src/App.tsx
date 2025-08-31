import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { Container } from '@mui/material';
function App() {
return (
<>
<Navbar />
<Container component="main" sx={{ py: 4 }}>
<Routes>
<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
<Route
path="/"
element={
<ProtectedRoute>
<DashboardPage />
</ProtectedRoute>
}
/>
</Routes>
</Container>
</>
);
}
export default App;