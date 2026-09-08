import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

const startServer = async (): Promise<void> => {
  await connectDatabase();
  app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`SIH artisan server listening on port ${env.PORT} (0.0.0.0)`);
  });
};

startServer().catch((error: unknown) => {
  console.error('Unable to start SIH artisan server.', error);
  process.exitCode = 1;
});
