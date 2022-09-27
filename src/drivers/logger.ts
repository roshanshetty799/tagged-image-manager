import {configure, getLogger} from 'log4js';

// appenders
configure({
    appenders: {
        console: { type: 'stdout', layout: { type: 'basic' } },
    },
    categories: {
        default: {appenders: ['console'], level: 'info'},
        E2E: { appenders: ['console'], level: 'info' }
    }
});

// fetch logger and export
export const logger = getLogger('E2E');