import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { financeService } from '../services/financeService';
import type { Category } from '../types';

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
}

const TransactionForm = ({ open, onClose, onSuccess, categories }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 0,
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await financeService.createTransaction({
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: Number(formData.category),
        type: formData.type as 'income' | 'expense',
        date: formData.date,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      alert('Erro ao criar transação. Por favor, tente novamente.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Nova Transação</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Valor"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descrição"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              label="Tipo"
            >
              <MenuItem value="income">Receita</MenuItem>
              <MenuItem value="expense">Despesa</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoria</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: Number(e.target.value) })}
              label="Categoria"
              required
            >
              {categories
                .filter((cat) => cat.type === formData.type)
                .map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Data"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
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

export default TransactionForm; 