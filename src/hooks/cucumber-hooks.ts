/*
 Author      : Roshan S.
 Description : Hooks are blocks of code that can run at various points in the Cucumber execution cycle.
               They are typically used for setup and teardown of the environment before and after each scenario.
               Where a hook is defined has no impact on what scenarios or steps it is run for.
*/


import {CustomWorld} from '../support/cucumber-world';
import {config} from '../support/config';
import {After, AfterAll, Before, BeforeAll, setDefaultTimeout, Status} from '@cucumber/cucumber';
import {chromium, ChromiumBrowser, firefox, FirefoxBrowser, webkit, WebKitBrowser,} from 'playwright';
import {ITestCaseHookParameter} from '@cucumber/cucumber/lib/support_code_library_builder/types';
import {AllPagesObject} from "../pages/all-pages-object";
import {ApiDriver} from "../drivers/api-driver";


let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;


setDefaultTimeout(180 * 1000);

BeforeAll(async function (this: CustomWorld) {

    switch (config.browser) {
        case 'firefox':
            browser = await firefox.launch(config.browserOptions);
            break;
        case 'webkit':
            browser = await webkit.launch(config.browserOptions);
            break;
        default:
            browser = await chromium.launch(config.browserOptions);
    }
});

Before({tags: '@Ignore'}, async function () {
    return 'skipped' as any;
});




Before( async function (this: CustomWorld, {pickle}: ITestCaseHookParameter) {
    this.testName = pickle.name.replace(/\W/g, '-');
    // customize the [browser context](https://playwright.dev/docs/next/api/class-browser#browsernewcontextoptions)
    this.feature = pickle;
    this.context = await browser.newContext({

        acceptDownloads: true,
        ignoreHTTPSErrors: true,
        viewport:{
            width:1200,
            height:800
        },
        locale: 'en-AU',

    });
    this.page = await this.context.newPage();
    this.pagesObj = new AllPagesObject(this.page, this.context, this.env);
    this.apiDriver = new ApiDriver(this.env);

});

After(async function (this: CustomWorld,{result}: ITestCaseHookParameter) {

    if (result) {

        if (this.env.APP === 'SampleUI_APP' && result.status === Status.FAILED ) {
            const image = await this.pagesObj!.basePage.driver.getScreenshot();
            image && (await this.attach(image, 'image/png'));
        }
    }
    await this.context?.close();

});


AfterAll(async function (this: CustomWorld) {
    await browser.close();

});






