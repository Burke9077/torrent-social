const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');

// Define your API routes here

// Serve the OpenAPI specification and Swagger UI
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
