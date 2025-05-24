import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { authService } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState<string | string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      await authService.register(formData.username, formData.email, formData.password);
      navigate('/login');
    } catch (err: any) {
      console.error('Erro no registro:', err);
      if (err.message) {
        try {
          const errorMessages = JSON.parse(err.message);
          setError(Array.isArray(errorMessages) ? errorMessages : [err.message]);
        } catch {
          setError([err.message]);
        }
      } else {
        setError(['Erro ao registrar usuário']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Registrar
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {Array.isArray(error) ? (
              error.map((msg, i) => (
                <Typography key={i} variant="body2" sx={{ mb: i < error.length - 1 ? 1 : 0 }}>
                  {msg}
                </Typography>
              ))
            ) : (
              <Typography variant="body2">{error}</Typography>
            )}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nome de usuário"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            error={Array.isArray(error) && error.some(msg => msg.includes('username'))}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={Array.isArray(error) && error.some(msg => msg.includes('email'))}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            error={Array.isArray(error) && error.some(msg => msg.includes('password'))}
            helperText="A senha deve ter pelo menos 8 caracteres"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Confirmar Senha"
            type="password"
            id="password2"
            value={formData.password2}
            onChange={handleChange}
            error={Array.isArray(error) && error.some(msg => msg.includes('password2'))}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 