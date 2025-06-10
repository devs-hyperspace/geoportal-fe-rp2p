import swaggerJsdoc from 'swagger-jsdoc';
import { NextResponse } from 'next/server';

// Swagger options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RP2P Geoportal Kemandagri API Documentation',
      version: '1.0.0',
      description: 'API documentation for RP2P Geoportal Kemandagri',
    },
    servers: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api`, // Update with your server URL
      },
    ],
    components: {
      securitySchemes: {
        APIKeyHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-KEY',
          description: 'Enter the API Key'
        },
      },
    },
    // security: [{ bearerAuth: [] }], 
  },
  apis: ['./app/api/**/*.ts'], // Path to your API routes
};

const swaggerSpec = swaggerJsdoc(options);

export const GET = async (req: Request) => {
  // Serve the Swagger UI HTML
  const swaggerUiHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Swagger UI</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css">
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
      <script>
        SwaggerUIBundle({
          spec: ${JSON.stringify(swaggerSpec)},
          dom_id: '#swagger-ui',
        });
      </script>
    </body>
    </html>
  `;

  return new NextResponse(swaggerUiHtml, {
    headers: { 'Content-Type': 'text/html' },
  });
};