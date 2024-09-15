import cron from 'node-cron';
import { logger } from '../middlewares/logger';
import { clearUploads } from './uploadsHandlers';

let pauses = 0;

const cronSchedule = '*/5 * * * *';// At every 5th minute   '*/5 * * * * *' ← At every 5th second

if (!cron.validate(cronSchedule)) {
  throw new Error('Invalid Cron Timer! Please check utils/schedules.ts');
}

export const clearUploadsJob = cron.schedule(
  cronSchedule,
  () => {
    if (pauses === 0) {
      logger.debug('clearing uploads...');
      clearUploads();
    }
  },
);

export const pauseUploadsClear = () => {
  pauses += 1;
};

export const resumeUploadsClear = () => {
  pauses -= 1;
};
