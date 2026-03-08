import 'dotenv/config';
import { app } from './app';
import { prisma } from './db/prisma';

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '0.0.0.0';

const server = app.listen(port, host, () => {
  console.log(`Backend API listening on http://${host}:${port}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down backend...`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
