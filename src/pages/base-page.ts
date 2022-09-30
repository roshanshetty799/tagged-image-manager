import {BrowserDriver} from "../drivers/browser-driver";
import {EnvConstants} from "../support/cucumber-world";
import {BrowserContext, Page} from "playwright";
import {logger} from "../drivers/logger";


export class BasePage{
    driver: BrowserDriver;
    env: EnvConstants;
    expect: typeof chai.expect;



    constructor(page: Page, context: BrowserContext, env: EnvConstants) {

        this.driver = new BrowserDriver(page, context);
        this.env = env;
        this.expect = require('chai');
    }

    async goToPage(pageName: string) {

        await this.driver.click(`a[href="#div-${pageName}"]`);
        await logger.info(`Navigated to page - ${pageName}`);
    }
}