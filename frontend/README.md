# Frontend React + TypeScript

Este é o frontend do projeto, desenvolvido com React, TypeScript e Tailwind CSS.

## Tecnologias Utilizadas

- React 18
- TypeScript
- React Router DOM
- Axios
- Tailwind CSS
- Vite

## Pré-requisitos

- Node.js 16.x ou superior
- npm ou yarn

## Instalação

1. Clone o repositório
2. Navegue até o diretório do frontend:
```bash
cd frontend
```

3. Instale as dependências:
```bash
npm install
# ou
yarn install
```

4. Crie um arquivo `.env` na raiz do projeto frontend com as seguintes variáveis:
```env
VITE_API_URL=http://localhost:8000/api
```

## Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em `http://localhost:5173`

## Build

Para criar uma versão de produção:

```bash
npm run build
# ou
yarn build
```

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── contexts/       # Contextos React (Auth, etc)
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Serviços de API
│   ├── types/         # Definições de tipos TypeScript
│   ├── App.tsx        # Componente principal
│   └── main.tsx       # Ponto de entrada
├── public/            # Arquivos estáticos
└── package.json       # Dependências e scripts
```

## Funcionalidades

- Autenticação com JWT
- Rotas protegidas
- Dashboard responsivo
- Integração com API REST
- Interface moderna com Tailwind CSS

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
