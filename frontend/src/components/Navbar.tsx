import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'background.paper', borderBottom: '1px solid #334155' }}>
      <Toolbar>
        <ChatIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
          FinChat
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {isAuthenticated ? (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Box>
            <Button component={RouterLink} to="/login" color="inherit">
              Login
            </Button>
            <Button component={RouterLink} to="/register" variant="contained" color="primary" sx={{ ml: 1 }}>
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}