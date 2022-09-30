import {IWorldOptions, setWorldConstructor, World} from '@cucumber/cucumber';
import * as messages from '@cucumber/messages';
import { BrowserContext, Page} from 'playwright';
import {AllPagesObject} from "../pages/all-pages-object";
import {ApiDriver } from "../drivers/api-driver";
import {APIResponse} from "@playwright/test";


export interface CucumberWorldConstructorParams {
    parameters: { [key: string]: string };
}

export interface EnvConstants {
    CLIENT: string;
    HOST: string;
    APP: string;
    ENV_CONFIG: object;
    JENKINSBUILD?: string;
    JENKINSUSER?: string;
}

export interface CustomWorld extends World {
    debug: boolean;
    feature?: messages.Pickle;
    context?: BrowserContext;
    page?: Page;
    testName?: string;
    startDate?: string;
    startTime?: string;
    env: EnvConstants;
    pagesObj?: AllPagesObject;
    apiDriver?: ApiDriver;
    response?:APIResponse;


}

export class CucumberWorld extends World implements CustomWorld {
    constructor(options: IWorldOptions) {
        super(options);
    }
    debug = false;
    env = {
        APP: process.env.APP!,
        CLIENT: process.env.CLIENT!,
        HOST: process.env.HOST!,
        ENV_CONFIG: process.env.JENKINSBUILD ? require('C:/Test_Automation/envConfig.json') : require('../../envConfig.json'),
        JENKINSBUILD: process.env.JENKINSBUILD,
        JENKINSUSER: process.env.JENKINSUSER
    };

}

setWorldConstructor(CucumberWorld);
