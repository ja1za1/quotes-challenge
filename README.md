# Quotes Challenge API

API desenvolvida com NestJS para gerenciamento de citações (quotes), tags e usuários.

## 📋 Descrição

API RESTful construída com NestJS que permite gerenciar citações, tags e usuários. O projeto inclui autenticação JWT, integração com MongoDB e documentação interativa da API.

## 🛠️ Tecnologias Utilizadas

### Core

- **NestJS** (^11.0.1) - Framework Node.js progressivo
- **TypeScript** (^5.7.3) - Linguagem de programação
- **Fastify** (^5.6.2) - Servidor HTTP de alta performance

### Banco de Dados

- **MongoDB** - Banco de dados NoSQL
- **Mongoose** (^9.0.1) - ODM para MongoDB
- **@nestjs/mongoose** (^11.0.3) - Integração NestJS com Mongoose

### Autenticação

- **@nestjs/jwt** (^11.0.2) - Autenticação JWT
- **bcrypt** (^6.0.0) - Hash de senhas

### Documentação

- **@nestjs/swagger** (^11.2.3) - Documentação Swagger
- **@scalar/nestjs-api-reference** (^1.0.11) - Interface de documentação interativa

### Outras

- **Puppeteer** (^24.32.1) - Web scraping/crawler
- **RxJS** (^7.8.1) - Programação reativa

### Desenvolvimento

- **pnpm** - Gerenciador de pacotes
- **ESLint** - Linter
- **Prettier** - Formatador de código
- **Jest** - Framework de testes

## 📦 Requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **pnpm** (gerenciador de pacotes)
- **MongoDB** (rodando localmente ou acesso a uma instância)

### Instalando o pnpm

Se você ainda não tem o pnpm instalado:

```bash
npm install -g pnpm
```

## 🚀 Como Rodar o Projeto

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar o MongoDB

Certifique-se de que o MongoDB está rodando localmente na porta padrão (27017). O projeto está configurado para conectar em `mongodb://localhost/nest`.

Se você precisar alterar a string de conexão, edite o arquivo `src/app.module.ts`:

```typescript
MongooseModule.forRoot('mongodb://localhost/nest');
```

### 3. Configurar variáveis de ambiente (opcional)

O projeto usa a porta 3000 por padrão. Para alterar, você pode definir a variável de ambiente `PORT`:

```bash
# Windows (PowerShell)
$env:PORT=3000

# Linux/Mac
export PORT=3000
```

### 4. Executar o projeto

```bash
# Modo desenvolvimento (com hot-reload)
pnpm run start:dev

# Modo produção
pnpm run start:prod

# Modo debug
pnpm run start:debug
```

A API estará disponível em `http://localhost:3000` (ou na porta configurada).

### 5. Acessar a documentação

Após iniciar o servidor, acesse a documentação interativa da API em:

```
http://localhost:3000/docs
```

## 📡 Endpoints da API

### Autenticação

#### `POST /auth/login`

Autentica um usuário e retorna um token JWT.

**Body:**

```json
{
  "name": "nome_do_usuario",
  "password": "senha_do_usuario"
}
```

**Resposta:**

```json
{
  "access_token": "jwt_token_aqui"
}
```

---

### Usuários

#### `GET /users`

Lista todos os usuários. **Requer autenticação.**

**Headers:**

```
Authorization: Bearer <token>
```

#### `GET /users/:name`

Busca um usuário pelo nome. **Requer autenticação.**

**Headers:**

```
Authorization: Bearer <token>
```

#### `POST /users`

Cria um novo usuário. **Não requer autenticação.**

**Body:**

```json
{
  "name": "nome_do_usuario",
  "password": "senha_do_usuario"
}
```

---

### Citações (Quotes)

#### `GET /quotes`

Lista todas as citações. **Requer autenticação.**

**Headers:**

```
Authorization: Bearer <token>
```

#### `POST /quotes`

Cria uma nova citação. **Requer autenticação.**

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "text": "Texto da citação",
  "author": "Autor da citação",
  "tags": ["tag1", "tag2"]
}
```

#### `GET /quotes/:searchTag`

Busca citações por tag. **Requer autenticação.**

**Headers:**

```
Authorization: Bearer <token>
```

**Exemplo:** `GET /quotes/motivacional`

---

### Tags

#### `GET /tags`

Lista todas as tags. **Requer autenticação.**

**Headers:**

```
Authorization: Bearer <token>
```

#### `POST /tags`

Cria uma nova tag. **Requer autenticação.**

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "name": "nome_da_tag"
}
```

#### `GET /tags/:name`

Busca uma tag pelo nome. **Requer autenticação.**

**Headers:**

```
Authorization: Bearer <token>
```

---

## 🔐 Autenticação

A maioria dos endpoints requer autenticação via JWT. Para acessar endpoints protegidos:

1. Faça login em `POST /auth/login` para obter o token
2. Inclua o token no header `Authorization` no formato:
   ```
   Authorization: Bearer <seu_token_jwt>
   ```

**Endpoints públicos (não requerem autenticação):**

- `POST /auth/login`
- `POST /users`

## 🧪 Testes

```bash
# Executar testes unitários
pnpm run test

# Executar testes em modo watch
pnpm run test:watch

# Executar testes e2e
pnpm run test:e2e

# Executar testes com cobertura
pnpm run test:cov
```

## 🏗️ Build

```bash
# Compilar o projeto
pnpm run build
```

O código compilado será gerado na pasta `dist/`.

## 📝 Scripts Disponíveis

- `pnpm run start` - Inicia o servidor
- `pnpm run start:dev` - Inicia em modo desenvolvimento (watch mode)
- `pnpm run start:debug` - Inicia em modo debug
- `pnpm run start:prod` - Inicia em modo produção
- `pnpm run build` - Compila o projeto
- `pnpm run format` - Formata o código com Prettier
- `pnpm run lint` - Executa o linter e corrige problemas
- `pnpm run test` - Executa testes unitários
- `pnpm run test:e2e` - Executa testes end-to-end
- `pnpm run test:cov` - Executa testes com cobertura

## 📚 Estrutura do Projeto

```
src/
├── auth/              # Módulo de autenticação
│   ├── controller/    # Controller de autenticação
│   ├── middleware/    # Middleware de autenticação
│   └── service/       # Serviço de autenticação
├── features/
│   ├── crawler/       # Módulo de web scraping
│   ├── quote/         # Módulo de citações
│   ├── tag/           # Módulo de tags
│   └── user/          # Módulo de usuários
└── main.ts            # Arquivo principal da aplicação
```

## 📄 Licença

Este projeto é privado e não licenciado.
