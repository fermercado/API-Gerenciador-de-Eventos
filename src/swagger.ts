import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API-Gerenciador-de-Eventos',
      version: '2.0.0',
      description:
        'Gerenciador de Eventos é uma plataforma desenvolvida em Node.js e TypeScript, utilizando MongoDB para o armazenamento de dados. O sistema, encapsulado em Docker e estruturado segundo a arquitetura MVC, permite a criacão de usuários e a gestão de eventos, incluindo funcionalidades de CRUD. É uma solução prática de controle sobre eventos e cadastro de usuários, com facilidade de manutenção e operação.',
      contact: {
        name: 'Fernando Mercado',
        email: 'fermercado@live.com',
      },
    },
  },
  apis: ['./src/docs/user-api.yaml', './src/docs/event-api.yaml'],
};

const specs = swaggerJsDoc(options);

export default function (app: Application) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
