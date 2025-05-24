import React, { useEffect, useState } from 'react';
import { profileService } from '../services/profileService';
import type { UserProfile } from '../types';
import {
  Box, Button, TextField, Typography, Avatar, Alert, Stack,
  Container, Paper, CircularProgress, Grid, useTheme, useMediaQuery
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  phone: z.string().min(10, 'Telefone deve ter no mínimo 10 dígitos').optional(),
  address: z.string().min(5, 'Endereço deve ter no mínimo 5 caracteres').optional(),
  city: z.string().min(2, 'Cidade deve ter no mínimo 2 caracteres').optional(),
  state: z.string().min(2, 'Estado deve ter no mínimo 2 caracteres').optional(),
  country: z.string().min(2, 'País deve ter no mínimo 2 caracteres').optional(),
  birth_date: z.string().optional(),
  bio: z.string().max(500, 'Bio deve ter no máximo 500 caracteres').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      reset(data);
      if (data.profile_picture) {
        setPreviewUrl(data.profile_picture);
      }
    } catch (err) {
      setError('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      if (file) formData.append('profile_picture', file);

      const updated = await profileService.updateProfile(formData);
      setProfile(updated);
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar perfil');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography 
            variant="h4" 
            gutterBottom 
            align="center"
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem' },
              mb: { xs: 2, sm: 3 }
            }}
          >
            Editar Perfil
          </Typography>
          
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              mb: 3,
              gap: 2
            }}>
              <Avatar
                src={previewUrl || profile?.profile_picture}
                alt="Foto de perfil"
                sx={{ 
                  width: { xs: 100, sm: 120 }, 
                  height: { xs: 100, sm: 120 },
                  border: '2px solid',
                  borderColor: 'primary.main'
                }}
              />
              <Button
                variant="outlined"
                component="label"
                size={isMobile ? "small" : "medium"}
                sx={{ maxWidth: 200 }}
              >
                {file ? 'Foto selecionada' : 'Selecionar foto'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Telefone"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Data de nascimento"
                  type="date"
                  {...register('birth_date')}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Endereço"
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Cidade"
                  {...register('city')}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Estado"
                  {...register('state')}
                  error={!!errors.state}
                  helperText={errors.state?.message}
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="País"
                  {...register('country')}
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Bio"
                  {...register('bio')}
                  error={!!errors.bio}
                  helperText={errors.bio?.message}
                  multiline
                  rows={4}
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size={isMobile ? "medium" : "large"}
              fullWidth
              sx={{ mt: 2 }}
            >
              Salvar Alterações
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 