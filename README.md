# Sistema de Gestão Financeira

Sistema de gestão financeira pessoal desenvolvido com Django e React.

## Tecnologias Utilizadas

### Backend
- Python 3.9+
- Django 4.2
- Django REST Framework
- JWT Authentication
- SQLite3

### Frontend
- React 18
- TypeScript
- Material-UI
- Axios
- React Router
- Context API

## Funcionalidades

- Autenticação de usuários (login/registro)
- Dashboard com resumo financeiro
- Gestão de categorias (receitas/despesas)
- Gestão de transações
- Interface responsiva
- Proteção de rotas
- Persistência de sessão

## Instalação

### Backend

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd web
```

2. Crie e ative o ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
.\venv\Scripts\activate  # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Execute as migrações:
```bash
python manage.py migrate
```

5. Inicie o servidor:
```bash
python manage.py runserver
```

### Frontend

1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
web/
├── frontend/           # Frontend React
│   ├── src/
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── contexts/   # Contextos React
│   │   ├── pages/      # Páginas da aplicação
│   │   ├── services/   # Serviços de API
│   │   └── types/      # Definições de tipos
│   └── package.json
├── myapp/             # Aplicação Django
│   ├── api/           # Endpoints da API
│   ├── models.py      # Modelos do banco de dados
│   └── views.py       # Views da API
├── myproject/         # Configurações do Django
└── requirements.txt   # Dependências Python
```

## Uso

1. Acesse `http://localhost:5173` no navegador
2. Faça login ou registre uma nova conta
3. No dashboard, você pode:
   - Visualizar resumo financeiro
   - Gerenciar categorias
   - Adicionar transações
   - Filtrar e buscar transações

## Screenshots

[Adicionar screenshots da aplicação aqui]

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request 