import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  LinearProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  AccountBalance as AccountBalanceIcon,
  ShowChart as ShowChartIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  AccountBalanceWallet as WalletIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const features = [
  {
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    title: 'Gestão Financeira Inteligente',
    description: 'Controle suas finanças com ferramentas avançadas de análise e previsão.',
    color: '#2196f3',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Segurança Máxima',
    description: 'Seus dados protegidos com as mais avançadas tecnologias de criptografia.',
    color: '#4caf50',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: 'Rápido e Eficiente',
    description: 'Interface intuitiva e processos otimizados para máxima produtividade.',
    color: '#ff9800',
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
    title: 'Análises Detalhadas',
    description: 'Relatórios e gráficos que ajudam você a tomar melhores decisões.',
    color: '#9c27b0',
  },
  {
    icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
    title: 'Multi-bancos',
    description: 'Gerencie todas as suas contas em um só lugar de forma integrada.',
    color: '#f44336',
  },
  {
    icon: <ShowChartIcon sx={{ fontSize: 40 }} />,
    title: 'Investimentos',
    description: 'Acompanhe seus investimentos e receba recomendações personalizadas.',
    color: '#00bcd4',
  },
];

const metrics = [
  {
    title: 'Economia Mensal',
    value: 'R$ 1.250,00',
    target: 'R$ 2.000,00',
    icon: <WalletIcon sx={{ fontSize: 40 }} />,
    color: '#2196f3',
    progress: 62.5,
  },
  {
    title: 'Investimentos',
    value: 'R$ 15.000,00',
    target: 'R$ 50.000,00',
    icon: <ShowChartIcon sx={{ fontSize: 40 }} />,
    color: '#4caf50',
    progress: 30,
  },
  {
    title: 'Metas Alcançadas',
    value: '3/5',
    icon: <TrophyIcon sx={{ fontSize: 40 }} />,
    color: '#ff9800',
    progress: 60,
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, login } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({
        username: loginForm.username,
        password: loginForm.password
      });
      setShowLogin(false);
      navigate('/dashboard');
    } catch (err) {
      setError('Usuário ou senha inválidos');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[REGISTRO] Iniciando processo de registro na página inicial');
    console.log('[REGISTRO] Dados do formulário:', registerForm);
    
    // Validação da senha
    if (registerForm.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    if (!/[A-Z]/.test(registerForm.password)) {
      setError('A senha deve conter pelo menos uma letra maiúscula');
      return;
    }

    if (!/[a-z]/.test(registerForm.password)) {
      setError('A senha deve conter pelo menos uma letra minúscula');
      return;
    }

    if (!/[0-9]/.test(registerForm.password)) {
      setError('A senha deve conter pelo menos um número');
      return;
    }

    if (!/[!@#$%^&*]/.test(registerForm.password)) {
      setError('A senha deve conter pelo menos um caractere especial (!@#$%^&*)');
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      console.log('[REGISTRO] Erro: senhas não coincidem');
      setError('As senhas não coincidem');
      return;
    }
    
    setError('');
    try {
      console.log('[REGISTRO] Chamando serviço de registro');
      const response = await authService.register(
        registerForm.username,
        registerForm.email,
        registerForm.password
      );
      console.log('[REGISTRO] Registro bem-sucedido:', response);
      
      login(response.user);
      setShowRegister(false);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('[REGISTRO] Erro no registro:', err);
      if (err.message.includes('Esta senha é muito comum')) {
        setError('A senha escolhida é muito comum. Por favor, escolha uma senha mais forte.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Hero Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            pt: { xs: 8, md: 12 },
            pb: { xs: 6, md: 8 },
            textAlign: 'center',
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: 'white',
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              Controle suas Finanças com Inteligência
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.9,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
              }}
            >
              Uma plataforma completa para gerenciar seus investimentos, gastos e receitas
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setShowRegister(true)}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                Criar Conta
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setShowLogin(true)}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                Entrar
              </Button>
            </Box>
          </Container>
        </MotionBox>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Recursos Principais
          </Typography>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionCard
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                    <Box
                      sx={{
                        color: feature.color,
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 'bold' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Login Dialog */}
        <Dialog open={showLogin} onClose={() => setShowLogin(false)} maxWidth="xs" fullWidth>
          <DialogTitle>
            Entrar
            <IconButton
              aria-label="close"
              onClick={() => setShowLogin(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <form onSubmit={handleLogin}>
            <DialogContent>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <TextField
                autoFocus
                margin="dense"
                label="Usuário"
                type="text"
                fullWidth
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
              />
              <TextField
                margin="dense"
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowLogin(false)}>Cancelar</Button>
              <Button type="submit" variant="contained">Entrar</Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Register Dialog */}
        <Dialog open={showRegister} onClose={() => setShowRegister(false)} maxWidth="xs" fullWidth>
          <DialogTitle>
            Criar Conta
            <IconButton
              aria-label="close"
              onClick={() => setShowRegister(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <form onSubmit={handleRegister}>
            <DialogContent>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              <TextField
                autoFocus
                margin="dense"
                label="Usuário"
                type="text"
                fullWidth
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                required
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
              />
              <TextField
                margin="dense"
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
                helperText="A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais (!@#$%^&*)"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="dense"
                label="Confirmar Senha"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowRegister(false)}>Cancelar</Button>
              <Button type="submit" variant="contained">Criar Conta</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ mb: 4, fontWeight: 'bold' }}
          >
            Bem-vindo de volta, {user.username}!
          </Typography>

          <Grid container spacing={3}>
            {metrics.map((metric, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          color: metric.color,
                          mr: 2,
                        }}
                      >
                        {metric.icon}
                      </Box>
                      <Typography variant="h6" component="h2">
                        {metric.title}
                      </Typography>
                    </Box>
                    <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {metric.value}
                    </Typography>
                    {metric.target && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Meta: {metric.target}
                      </Typography>
                    )}
                    <LinearProgress
                      variant="determinate"
                      value={metric.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: `${metric.color}20`,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: metric.color,
                        },
                      }}
                    />
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Próximos Passos
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Complete seu Perfil
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                      Adicione mais informações ao seu perfil para receber recomendações personalizadas.
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/profile')}
                      startIcon={<TimelineIcon />}
                    >
                      Atualizar Perfil
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Explore o Dashboard
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                      Acesse análises detalhadas e relatórios personalizados no seu dashboard.
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/dashboard')}
                      startIcon={<ShowChartIcon />}
                    >
                      Ver Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </MotionBox>
      </Container>
    </Layout>
  );
};

export default Home; 