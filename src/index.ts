import {ApplicationConfig, BasketBallApplication} from './application';
import {migrateDatabase} from './migrations';
export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new BasketBallApplication(options);
  await app.boot();
  await app.start();

  // const job = new CronJob({
  //   cronTime: '*/10 * * * * *',
  //   onTick: async () => {
  //     await migrateDatabase(app);
  //   },
  //   start: true,
  // });
  // app.bind('cron.jobs.job1').to(job).apply(asCronJob);

  await migrateDatabase(app);

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 4000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
