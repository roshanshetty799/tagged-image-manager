import {LaunchOptions} from 'playwright';

const browserOptions: LaunchOptions = {
  headless:false,
  slowMo:1000,
  timeout: 120000,
  channel: 'chrome'
};

export const config = {
  browser: process.env.BROWSER || 'chrome',
  browserOptions
};
