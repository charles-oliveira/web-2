import { useEffect } from 'react';
import { Container } from '@mui/material';

const ApiRedoc = () => {
  useEffect(() => {
    window.location.href = 'http://localhost:8000/api/redoc/';
  }, []);

  return (
    <Container>
      <div>Redirecionando para a documentação ReDoc da API...</div>
    </Container>
  );
};

export default ApiRedoc; 