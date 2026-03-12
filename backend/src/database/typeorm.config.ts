import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function createTypeOrmOptions(): TypeOrmModuleOptions {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to start the backend.');
  }

  return {
    type: 'postgres',
    url: databaseUrl,
    autoLoadEntities: true,
    synchronize: false,
    logging: false,
  };
}

