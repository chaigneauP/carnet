import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('api/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth() {
    try {
      await this.healthService.checkDatabaseConnection();

      return {
        status: 'ok',
        database: 'up',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'down',
        message: error instanceof Error ? error.message : 'Unknown database error',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
