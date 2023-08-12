const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ReddyGirl',
      version: '1.0.0',
      description: 'API documentation for your Express application',
    },
  },
  apis: ['./index.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
