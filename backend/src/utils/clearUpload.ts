//npm install cron

import { CronJob } from 'cron';
import * as fs from 'node:fs/promises'
import path from 'path'
/*import { getDirname } from './getDirname';
const __dirname = getDirname(import.meta.url);*/


//const clearFiles = (folder)

const clearFiles = async (folder:string) => {
  let items
  try {
    items = await fs.readdir(folder);
  } catch (error) {
    console.error(error);
    return
  }
  for (const item of items) {
    const fullPath = path.join(folder, item);
    const stat = await fs.stat(fullPath);
    if (!stat.isDirectory()) {
      //await fs.unlink(fullPath);
      console.log(fullPath);
    }
  }
}

export const clearUploadsJob = new CronJob(
  '* 1 * * * *', // cronTime
  function () {
    clearFiles(path.join(__dirname, '../public/upload'));
  }
);
let pauses = 0;
export const pauseUploadsClear = () => {
  clearUploadsJob.stop();
  pauses++;
}

export const resumeUploadsClear = () => {
  pauses--;
  if (!pauses) {
    clearUploadsJob.start();
  }
}

