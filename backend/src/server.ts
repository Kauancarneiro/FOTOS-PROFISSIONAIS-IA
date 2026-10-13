import 'dotenv/config';
import app from './app';
import { prisma } from './config/database';
import { env } from './config/env';
import { logger } from './config/logger';

async function main() {
  await prisma.$connect();
  logger.info('✅ Banco de dados conectado');

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Servidor rodando na porta ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} recebido. Encerrando servidor...`);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info('Servidor encerrado com sucesso');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error('Falha ao iniciar servidor', { error: err });
  process.exit(1);
});
