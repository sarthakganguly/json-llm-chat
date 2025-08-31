import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Container, Paper, Typography, TextField, Button, Box, Link, CircularProgress, Alert } from '@mui/material';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.post('/auth/users/', { email, password, tenant_name: tenantName });
      navigate('/login');
    } catch (err) {
      setError('Failed to register. The email might already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create an Account
          </Typography>
          <Typography color="text.secondary">
            Get started with your financial data
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal" required fullWidth id="tenantName"
            label="Company / Tenant Name" name="tenantName" autoFocus
            value={tenantName} onChange={(e) => setTenantName(e.target.value)}
          />
          <TextField
            margin="normal" required fullWidth id="email"
            label="Email Address" name="email" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal" required fullWidth name="password" label="Password"
            type="password" id="password"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button
            type="submit" fullWidth variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
          </Button>
          <Typography align="center" color="text.secondary">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" variant="body2">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}