import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Alert,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Avatar,
  Tabs,
  Tab,
  Slide,
  Snackbar,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { settingsService, type UserSettings } from '../services/settingsService';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types';

const Settings: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    language: 'pt-BR',
    twoFactorAuth: false,
    dataSharing: true,
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      setError('Erro ao carregar configurações');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (setting: keyof UserSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [setting]: event.target.checked,
    });
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSettings({
      ...settings,
      language: event.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await settingsService.updateSettings(settings);
      setSuccess('Configurações salvas com sucesso!');
      setSnackbarOpen(true);
    } catch (err) {
      setError('Erro ao salvar configurações. Tente novamente.');
      setSnackbarOpen(true);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSuccess(null);
    setError(null);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, position: 'relative' }}>
      {/* Resumo do usuário */}
      <Paper sx={{ p: { xs: 2, sm: 4 }, mb: 4, display: 'flex', alignItems: 'center', gap: 3 }} elevation={2}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
          <PersonIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{user?.username}</Typography>
          <Typography color="text.secondary">{user?.email}</Typography>
        </Box>
      </Paper>

      {/* Abas */}
      <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 4 }} elevation={1}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : false}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<NotificationsIcon />} label="Preferências" />
          <Tab icon={<PaletteIcon />} label="Aparência" />
          <Tab icon={<SecurityIcon />} label="Privacidade" />
        </Tabs>
      </Paper>

      {/* Conteúdo das Abas */}
      <Slide direction="up" in mountOnEnter unmountOnExit>
        <Box>
          {tab === 0 && (
            <Paper sx={{ p: { xs: 2, sm: 4 }, mb: 4 }}>
              <Typography variant="h6" gutterBottom>Notificações</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={handleChange('emailNotifications')}
                      />
                    }
                    label="Notificações por e-mail"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={handleChange('pushNotifications')}
                      />
                    }
                    label="Notificações push"
                  />
                </Grid>
              </Grid>
            </Paper>
          )}
          {tab === 1 && (
            <Paper sx={{ p: { xs: 2, sm: 4 }, mb: 4 }}>
              <Typography variant="h6" gutterBottom>Aparência</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.darkMode}
                        onChange={handleChange('darkMode')}
                      />
                    }
                    label="Modo escuro"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Idioma</InputLabel>
                    <Select
                      value={settings.language}
                      onChange={handleLanguageChange}
                      label="Idioma"
                    >
                      <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                      <MenuItem value="en-US">English (US)</MenuItem>
                      <MenuItem value="es">Español</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          )}
          {tab === 2 && (
            <Paper sx={{ p: { xs: 2, sm: 4 }, mb: 4 }}>
              <Typography variant="h6" gutterBottom>Privacidade e Segurança</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={handleChange('twoFactorAuth')}
                      />
                    }
                    label="Autenticação de dois fatores"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.dataSharing}
                        onChange={handleChange('dataSharing')}
                      />
                    }
                    label="Compartilhar dados de uso para melhorias"
                  />
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      </Slide>

      {/* Botão de salvar fixo em telas grandes */}
      <Box sx={{
        position: { xs: 'static', md: 'fixed' },
        bottom: { md: 32 },
        right: { md: 32 },
        width: { xs: '100%', md: 'auto' },
        zIndex: 1000,
        display: 'flex',
        justifyContent: { xs: 'center', md: 'flex-end' },
        mt: { xs: 2, md: 0 },
      }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ minWidth: 200, fontWeight: 700, fontSize: '1.1rem', boxShadow: 2 }}
        >
          Salvar Configurações
        </Button>
      </Box>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert onClose={handleSnackbarClose} severity={success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {success || error || ''}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings; 