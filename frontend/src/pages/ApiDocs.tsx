import { useEffect } from 'react';
import { Container } from '@mui/material';

const ApiDocs = () => {
  useEffect(() => {
    window.location.href = 'http://localhost:8000/api/docs/';
  }, []);

  return (
    <Container>
      <div>Redirecionando para a documentação da API...</div>
    </Container>
  );
};

export default ApiDocs; 