import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'carnet-backend',
      status: 'ok',
      docs: ['/api/health', '/api/games'],
    };
  }
}

