<h1 align="center">
  Navy API Backend
</h1>

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/mongodb-%2347A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Supabase](https://img.shields.io/badge/supabase-%233FCF8E.svg?style=for-the-badge&logo=supabase&logoColor=white)
![Express](https://img.shields.io/badge/express-%23000000.svg?style=for-the-badge&logo=express&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## 💻 Projeto

O **Navy Backend** é uma API RESTful voltada para o gerenciamento de uma frota de veículos, permitindo operações de cadastro, venda, aluguel, autenticação de usuários e acesso a métricas administrativas via dashboard.

Ele oferece um conjunto robusto de recursos com **foco em segurança**, **controle de acesso baseado em papéis (RBAC)** e **limitação de requisições**.

## ✨ Funcionalidades

- 🚗 Cadastro, edição, listagem e remoção de veículos (para venda ou aluguel)
- 📦 Upload de fotos e documentos para Supabase Storage
- 👥 Cadastro e controle de usuários com diferentes papéis: `admin`, `employee`, `client`
- 🔐 **Autenticação com JWT**
- 🔒 **Controle de permissões com RBAC** para proteger rotas conforme papel do usuário
- 📊 Dashboard com dados estatísticos (usuários ativos, carros vendidos, carros alugados, receitas mensais etc.)
- 📑 Documentação automática das rotas com Swagger
- 🛡️ **Limitação de taxa de requisições (Rate Limit)** para proteger a API contra abuso

## 🔐 Segurança

### 🛡️ Autenticação com JWT

- Todos os endpoints sensíveis exigem que o usuário esteja autenticado via token JWT.

### 🔒 Autorização com o Padrão RBAC — Controle de Acesso Baseado em Papéis

- Controle de permissão baseado em papéis (roles)
- Os usuários são categorizados como `admin`, `employee` ou `client`.
- As permissões são aplicadas por recurso e ação (`create`, `edit`, `delete`, `view`) por meio de middlewares reutilizáveis.

### ⛑ Rate Limiting

- Utilização de `express-rate-limit` para restringir a quantidade de requisições por IP, protegendo contra ataques de força bruta e abuso de API.

## 📊 Exemplo de Dados do Dashboard

- Total de usuários ativos/inativos
- Distribuição por gênero
- Total de carros cadastrados, vendidos e alugados
- Receitas mensais
- Vendas por modelo de carro

## 📦 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [Supabase Storage](https://supabase.com/)
- [JWT](https://jwt.io/)
- [Multer](https://github.com/expressjs/multer)
- [Swagger + OpenAPI](https://swagger.io/)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)

## 🚀 Como rodar o projeto

1. Clone o repositório e instale as dependências:

```bash
npm install
```

2. Configure o arquivo `.env` com suas variáveis (veja `.env.example`).

3. (Opcional) Popule o banco com dados fictícios:

```bash
npm run seed
```

4. Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

## 🌐 Teste a API

- Acesse o Swagger para testar a documentação interativa:

```txt
http://localhost:3000/swagger
```

- Ou utilize um client REST:
  - [Hoppscotch (Web)](https://hoppscotch.io/)
  - [REST Client (VS Code Extension)](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

## 🛠 Estrutura de Pastas

```txt
src/
├── controllers/   -- Camada dos Controllers
├── middlewares/   -- Middlewares de controle de chamadas da API
├── models/        -- Schemas do MongoDB
├── routes/        -- Definição das rotas
├── security/      -- RBAC (checkPermission.ts, permissions.ts)
├── services/      -- Camada de Serviço das APIs
├── utils/         -- Supabase, helpers, etc.
└── swagger/       -- Configuração do swagger
```
