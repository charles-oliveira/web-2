import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { financeService } from '../services/financeService';
import type { FinancialSummary, Transaction, Category } from '../types';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import TransactionForm from '../components/TransactionForm';
import CategoryList from '../components/CategoryList';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: '',
  });
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      console.log('Iniciando carregamento dos dados do dashboard');
      setLoading(true);
      
      console.log('Buscando categorias...');
      const categoriesData = await financeService.getCategories();
      console.log('Categorias recebidas:', categoriesData);
      
      console.log('Buscando resumo financeiro...');
      const summaryData = await financeService.getFinancialSummary();
      console.log('Resumo financeiro recebido:', summaryData);
      
      console.log('Buscando transações...');
      const transactionsData = await financeService.getTransactions();
      console.log('Transações recebidas:', transactionsData);
      
      console.log('Atualizando estado com os dados recebidos');
      setCategories(categoriesData);
      setSummary(summaryData);
      setTransactions(transactionsData);
      
      console.log('Estado atualizado:', {
        categories: categoriesData,
        summary: summaryData,
        transactions: transactionsData
      });
    } catch (error: any) {
      console.error('Erro detalhado ao carregar dados:', {
        error: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        headers: error?.response?.headers
      });
      
      // Se o erro for de autenticação, redirecionar para o login
      if (error?.response?.status === 401) {
        window.location.href = '/';
        return;
      }
      
      // Mostrar mensagem de erro para o usuário
      setError('Erro ao carregar dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.category_name && transaction.category_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = (!dateFilter.start || transaction.date >= dateFilter.start) &&
      (!dateFilter.end || transaction.date <= dateFilter.end);

    return matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Cabeçalho */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Dashboard Financeiro
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsTransactionFormOpen(true)}
            >
              Nova Transação
            </Button>
          </Box>
        </Grid>

        {/* Cards de Resumo */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Receitas</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                R$ {summary?.total_income.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingDown color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Despesas</Typography>
              </Box>
              <Typography variant="h4" color="error.main">
                R$ {summary?.total_expense.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AccountBalance sx={{ mr: 1 }} />
                <Typography variant="h6">Saldo</Typography>
              </Box>
              <Typography
                variant="h4"
                color={summary?.balance && summary.balance >= 0 ? 'success.main' : 'error.main'}
              >
                R$ {summary?.balance.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabs e Filtros */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ mb: 2 }}
            >
              <Tab label="Transações" />
              <Tab label="Categorias" />
            </Tabs>

            {activeTab === 0 && (
              <>
                <Box display="flex" gap={2} mb={2}>
                  <TextField
                    label="Buscar"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Data Inicial"
                    type="date"
                    size="small"
                    value={dateFilter.start}
                    onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Data Final"
                    type="date"
                    size="small"
                    value={dateFilter.end}
                    onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Data</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Categoria</TableCell>
                        <TableCell align="right">Valor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              color: transaction.type === 'income' ? 'success.main' : 'error.main',
                            }}
                          >
                            R$ {transaction.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {activeTab === 1 && (
              <CategoryList categories={categories} onUpdate={loadData} />
            )}
          </Paper>
        </Grid>
      </Grid>

      <TransactionForm
        open={isTransactionFormOpen}
        onClose={() => setIsTransactionFormOpen(false)}
        onSuccess={loadData}
        categories={categories}
      />
    </Container>
  );
};

export default Dashboard; 