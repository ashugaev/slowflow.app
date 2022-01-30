const { CronJob } = require('cron');
const { log } = require('../../common/utils/log');

module.exports.startCronJob = ({
  name,
  period,
  callback,
  callbackArgs,
  executeBeforeInit,
}) => {
  const job = new CronJob(
    period,
    async () => {
      log.info('Start cron job:', name);

      try {
        callbackArgs
          ? await callback(...callbackArgs)
          : await callback();
      } catch (e) {
        log.error('Cron job error', e);
      }
    },
    () => {
      log.info('Complete cron job:', name);
    },
    false,
    'Europe/Moscow',
    null,
    executeBeforeInit,
  );

  job.timeout = 1000;

  job.start();

  return job;
};
