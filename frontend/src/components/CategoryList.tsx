import { useState } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Box,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { financeService } from '../services/financeService';
import type { Category } from '../types';
import CategoryForm from './CategoryForm';

interface CategoryListProps {
  categories: Category[];
  onUpdate: () => void;
}

const CategoryList = ({ categories, onUpdate }: CategoryListProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await financeService.deleteCategory(id);
        onUpdate();
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCategory(undefined);
  };

  const handleFormSuccess = () => {
    onUpdate();
    handleFormClose();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Categorias</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
        >
          Nova Categoria
        </Button>
      </Box>

      <List>
        {categories.map((category) => (
          <ListItem key={category.id}>
            <ListItemText
              primary={category.name}
              secondary={
                <Chip
                  label={category.type === 'income' ? 'Receita' : 'Despesa'}
                  color={category.type === 'income' ? 'success' : 'error'}
                  size="small"
                />
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleEdit(category)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(category.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <CategoryForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        category={selectedCategory}
      />
    </Paper>
  );
};

export default CategoryList; 