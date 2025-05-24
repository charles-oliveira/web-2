import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { financeService } from '../services/financeService';
import type { Category } from '../types';

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category;
}

const CategoryForm = ({ open, onClose, onSuccess, category }: CategoryFormProps) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    type: category?.type || 'expense',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Enviando dados da categoria:', formData);
      if (category) {
        await financeService.updateCategory(category.id, formData);
      } else {
        await financeService.createCategory(formData);
      }
      console.log('Categoria salva com sucesso');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar categoria:', {
        error: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      
      let errorMessage = 'Erro ao salvar categoria. Por favor, tente novamente.';
      
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.details) {
        if (typeof error.response.data.details === 'string') {
          errorMessage = error.response.data.details;
        } else if (Array.isArray(error.response.data.details)) {
          errorMessage = error.response.data.details.join('\n');
        } else if (typeof error.response.data.details === 'object') {
          errorMessage = Object.entries(error.response.data.details)
            .map(([field, messages]) => `${field}: ${messages}`)
            .join('\n');
        }
      }
      
      alert(errorMessage);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {category ? 'Editar Categoria' : 'Nova Categoria'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
              label="Tipo"
            >
              <MenuItem value="income">Receita</MenuItem>
              <MenuItem value="expense">Despesa</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryForm; 