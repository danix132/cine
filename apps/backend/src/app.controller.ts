import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Principal')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Página principal de la API' })
  @ApiResponse({ 
    status: 200, 
    description: 'Información de la API de Cine',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        version: { type: 'string' },
        description: { type: 'string' },
        endpoints: { 
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  })
  getHello() {
    return {
      message: 'Bienvenido a la API de Cine',
      version: '1.0.0',
      description: 'API para gestión de cine, películas, funciones, boletos y más',
      endpoints: [
        '/auth - Autenticación de usuarios',
        '/users - Gestión de usuarios',
        '/peliculas - Gestión de películas',
        '/salas - Gestión de salas',
        '/funciones - Gestión de funciones',
        '/boletos - Gestión de boletos',
        '/carritos - Gestión de carritos de compra',
        '/pedidos - Gestión de pedidos',
        '/dulceria - Gestión de dulcería',
        '/reportes - Reportes del sistema'
      ]
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Verificar estado de la API' })
  @ApiResponse({ 
    status: 200, 
    description: 'API funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string' }
      }
    }
  })
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString()
    };
  }
}
