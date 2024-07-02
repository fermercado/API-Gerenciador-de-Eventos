# Gerenciador de Eventos 🚀

## Descrição 📝

Gerenciador de Eventos é uma plataforma desenvolvida em Node.js e TypeScript, utilizando MongoDB para o armazenamento de dados. O sistema, encapsulado em Docker e estruturado segundo a arquitetura MVC, permite a criacão de usuários e a gestão de eventos, incluindo funcionalidades de CRUD. É uma solução prática de controle sobre eventos e cadastro de usuários, com facilidade de manutenção e operação.

## 🛠️ Tecnologias e Ferramentas Utilizadas

- **Node.js**: Plataforma para execução de JavaScript no servidor.
- **TypeScript (v5.3.3)**: JavaScript com tipagem estática.
- **Express (v4.18.2)**: Framework web para Node.js.
- **Mongoose (v8.0.3)**: Biblioteca para modelar dados no MongoDB.
- **JSON Web Token - JWT (v9.0.2)**: Biblioteca para autenticação e autorização.
- **bcryptjs (v2.4.3)**: Biblioteca para hashing de senhas.
- **Swagger UI Express (v5.0.1)** e **Swagger JSDoc (v6.2.8)**: Ferramentas para documentação de APIs.
- **Yup (v1.3.3)**: Biblioteca para validação de esquemas de dados.

## 🚀 Começando

## Documentação da API hospedada

Você pode acessar a documentação interativa da API FastFeet através do seguinte link:  
[Documentação Gerenciador de Eventos ](https://gerenciador-de-eventos.onrender.com)

**Nota:** A aplicação está hospedada no Render, o que pode resultar em uma inicialização mais lenta se o serviço estiver inativo. Aguarde alguns segundos após abrir o link.

### Rodando o Projeto Localmente

Para rodar o projeto localmente, siga os passos abaixo:

## Instalação

1. **Clone este repositório:**
   ```sh
   git clone https://github.com/fermercado/Gerenciador-de-Eventos.git
   ```
2. **Navegue até o diretório do projeto:**
   ```sh
   cd Gerenciador-de-Eventos
   ```
3. **Instale as dependências:**
   ```sh
   npm install
   ```
4. **Renomeie o arquivo de exemplo de variáveis de ambiente:**

   Renomeie o arquivo `.env.example` para `.env`:

   ```bash
   mv .env.example .env
   ```

5. **Configure as variáveis de ambiente:**
   ```env
   MONGODB_USERNAME=
   MONGODB_PASSWORD=
   JWT_SECRET=
   MONGODB_HOST=
   MONGODB_DATABASE=
   ```

### 🧪 Testando o Projeto

Para rodar os testes, use o seguinte comando:

```bash
npm run test
```

### 🚀 Iniciando o Servidor

Para iniciar o servidor, use o seguinte comando:

```bash
npm start
```

## 📃 Documentação da API com Swagger local

A documentação completa da API está disponível e pode ser acessada via Swagger UI. Isso permite que você visualize e interaja com a API's endpoints diretamente através do navegador.

Para acessar a documentação Swagger e testar os endpoints:

```bash
http://localhost:3000/
```

### Endpoints

#### Criar Usuário

- **Endpoint:** `/api/v1/users/sign-up`
- **Método:** `POST`
- **Descrição:** Cria um novo usuário.
- **Body:**
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "birthDate": "dd/mm/yyyy",
    "city": "string",
    "country": "string",
    "email": "string",
    "password": "string",
    "confirmPassword": "string"
  }
  ```

#### Login de Usuário

- **Endpoint:** `/api/v1/users/sign-in`
- **Método:** `POST`
- **Descrição:** Realiza o login de um usuário.
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

#### Atualizar Usuário

- **Endpoint:** `/api/v1/users/:id`
- **Método:** `PUT`
- **Descrição:** Atualiza um usuário existente.
- **Body:**
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "birthDate": "dd/mm/yyyy",
    "city": "string",
    "country": "string",
    "email": "string"
  }
  ```

#### Criar Evento

- **Endpoint:** `/api/v1/events`
- **Método:** `POST`
- **Descrição:** Cria um novo evento.
- **Body:**
  ```json
  {
    "description": "Event Description",
    "dayOfWeek": "monday"
  }
  ```

#### Listar Eventos

- **Endpoint:** `/api/v1/events`
- **Método:** `GET`
- **Descrição:** Lista todos os eventos.

#### Obter Evento por ID

- **Endpoint:** `/api/v1/events/:id`
- **Método:** `GET`
- **Descrição:** Obtém os detalhes de um evento específico.

#### Deletar Evento por ID

- **Endpoint:** `/api/v1/events/:id`
- **Método:** `DELETE`
- **Descrição:** Remove um evento específico.

#### Deletar Eventos por Dia da Semana

- **Endpoint:** `/api/v1/events`
- **Método:** `DELETE`
- **Descrição:** Remove eventos de um dia específico da semana.
