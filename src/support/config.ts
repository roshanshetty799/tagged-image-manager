import {LaunchOptions} from 'playwright';

const browserOptions: LaunchOptions = {
  headless:false,
  slowMo:1000,
  timeout: 120000,
 };

export const config = {
  browser: process.env.BROWSER || 'chromium',
  browserOptions
};
