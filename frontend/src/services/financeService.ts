import api from './api';
import type { Transaction, Category, FinancialSummary } from '../types';

export const financeService = {
  getFinancialSummary: async (): Promise<FinancialSummary> => {
    try {
      console.log('Buscando resumo financeiro');
      const response = await api.get('/api/v1/finance/summary/');
      console.log('Resumo financeiro recebido:', response.data);
      
      // Garantir que os valores numéricos são números
      const summary: FinancialSummary = {
        total_income: Number(response.data.total_income) || 0,
        total_expense: Number(response.data.total_expense) || 0,
        balance: Number(response.data.balance) || 0,
        recent_transactions: response.data.recent_transactions || []
      };
      
      console.log('Resumo financeiro processado:', summary);
      return summary;
    } catch (error: any) {
      console.error('Erro ao buscar resumo financeiro:', {
        error: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      throw error;
    }
  },

  getTransactions: async (): Promise<Transaction[]> => {
    try {
      console.log('Buscando transações');
      const response = await api.get('/api/v1/finance/transactions/');
      console.log('Transações recebidas:', response.data);
      
      if (!response.data?.results) {
        console.error('Resposta da API não contém dados de transações');
        return [];
      }
      
      // Garantir que as transações têm os campos necessários
      const transactions = (response.data.results || []).map((t: any) => ({
        id: t.id,
        amount: Number(t.amount) || 0,
        description: t.description || '',
        date: t.date || new Date().toISOString(),
        type: t.type || 'expense',
        category: t.category || null,
        category_name: t.category_name || ''
      }));
      
      console.log('Transações processadas:', transactions);
      return transactions;
    } catch (error: any) {
      console.error('Erro ao buscar transações:', {
        error: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      throw error;
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      console.log('Iniciando busca de categorias');
      const response = await api.get('/api/v1/finance/categories/');
      console.log('Resposta bruta da API:', response);
      
      if (!response.data?.results) {
        console.error('Resposta da API não contém dados de categorias');
        return [];
      }
      
      console.log('Dados recebidos da API:', response.data.results);
      
      // Garantir que as categorias têm os campos necessários
      const categories = (response.data.results || []).map((c: any) => {
        console.log('Processando categoria:', c);
        return {
          id: c.id,
          name: c.name || '',
          type: c.type || 'expense',
          created_at: c.created_at || new Date().toISOString(),
          updated_at: c.updated_at || new Date().toISOString()
        };
      });
      
      console.log('Categorias processadas:', categories);
      return categories;
    } catch (error: any) {
      console.error('Erro detalhado ao buscar categorias:', {
        error: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        headers: error?.response?.headers
      });
      throw error;
    }
  },

  createTransaction: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    try {
      console.log('Criando transação:', transaction);
      const response = await api.post('/api/v1/finance/transactions/', transaction);
      console.log('Transação criada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar transação:', {
        error: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      throw error;
    }
  },

  updateTransaction: async (id: number, transaction: Partial<Transaction>): Promise<Transaction> => {
    try {
      console.log('Atualizando transação:', { id, transaction });
      const response = await api.patch(`/api/v1/finance/transactions/${id}/`, transaction);
      console.log('Transação atualizada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar transação:', {
        error: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      throw error;
    }
  },

  deleteTransaction: async (id: number): Promise<void> => {
    try {
      console.log('Deletando transação:', id);
      await api.delete(`/api/v1/finance/transactions/${id}/`);
      console.log('Transação deletada com sucesso');
    } catch (error: any) {
      console.error('Erro ao deletar transação:', {
        error: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      throw error;
    }
  },

  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    try {
      console.log('Criando categoria:', category);
      const response = await api.post('/api/v1/finance/categories/', category);
      console.log('Categoria criada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar categoria:', {
        error: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      
      if (error?.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      if (error?.response?.data?.details) {
        if (typeof error.response.data.details === 'string') {
          throw new Error(error.response.data.details);
        } else if (Array.isArray(error.response.data.details)) {
          throw new Error(error.response.data.details.join('\n'));
        } else if (typeof error.response.data.details === 'object') {
          const details = Object.entries(error.response.data.details)
            .map(([field, messages]) => `${field}: ${messages}`)
            .join('\n');
          throw new Error(details);
        }
      }
      
      throw error;
    }
  },

  updateCategory: async (id: number, category: Partial<Category>): Promise<Category> => {
    try {
      console.log('Atualizando categoria:', { id, category });
      const response = await api.patch(`/api/v1/finance/categories/${id}/`, category);
      console.log('Categoria atualizada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar categoria:', {
        error: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      throw error;
    }
  },

  deleteCategory: async (id: number): Promise<void> => {
    try {
      console.log('Deletando categoria:', id);
      await api.delete(`/api/v1/finance/categories/${id}/`);
      console.log('Categoria deletada com sucesso');
    } catch (error: any) {
      console.error('Erro ao deletar categoria:', {
        error: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      throw error;
    }
  },
}; 