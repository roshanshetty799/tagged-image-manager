/*
 Author      : Roshan S.
 Description : This class contains a wrapper for frequently used Playwright page objects.
               Best Practice is not to use them directly as this way we centralize our customized code into a single place.
 */

import {BrowserContext, Page} from "playwright";
import {logger} from "./logger";


export class BrowserDriver {

    page: Page;
    context: BrowserContext;
    waitTimeout: number;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.waitTimeout = 60000;
    }

    /**
     * Single click on element matching @cssSelector
     * @param cssSelector
     * @param index
     * @param options
     */
    async click(cssSelector: string,index= 0,options = {timeout: this.waitTimeout}): Promise<void> {
         await this.page.click(`${cssSelector} >> nth=${index}`, options);
    }

    async hover(cssSelector: string,index=0): Promise<void> {
        await this.page.hover(`${cssSelector} >> nth=${index}`, {timeout: this.waitTimeout});
    }

    async clickAndWaitForPageToLoad(cssSelector: string): Promise<void>{
        await Promise.all([
            this.context.waitForEvent('page'),
            this.click(cssSelector)
        ]);
    }

    /**
     * Waits for element matching @cssSelector
     * @param cssSelector
     */
    async waitForSelector(cssSelector: string) {
        await this.page.waitForSelector(cssSelector, {timeout: this.waitTimeout});
    }

    /**
     * Waits for new tab to fully load post clicking on the element matching @cssSelector
     * and returns the new Tab as "Page" object
     * @param cssSelector
     */
    async clickAndWaitForNewTab(cssSelector: string): Promise<Page> {
        const [newPage] = await Promise.all([
            this.context.waitForEvent('page', {timeout: this.waitTimeout}),
            this.click(cssSelector),

        ])
        await newPage.waitForLoadState();
        return newPage;

    }

    /**
     *  Returns title of the page the driver is currently on
     */
    async getPageTitle(): Promise<string> {
        return this.page.title();
    }

    /**
     *  Takes a screenshot of the full scrollable page
     */
    async getScreenshot(): Promise<Buffer> {
        return this.page.screenshot({fullPage: true})
    }

    /**
     * Clicks on the file download button and saves the file under the default name
     * in downloads directory
     * @param cssSelector - Selector of the file download button
     */
    async download(cssSelector: string): Promise<void> {
        const [download] = await Promise.all([
            this.page.waitForEvent('download'), // wait for download to start
            this.click(cssSelector)
        ]);
        await download.saveAs(`downloads/${download.suggestedFilename()}`);
    }

    /**
     * Reads all the open pages in the same context and
     * returns the page matching the specified index
     * @param index - Index number of the browser tab you wish to return.
     */
    async getPageByIndex(index: number): Promise<Page> {
        return this.context.pages()[index];
    }

    /**
     * A wrapper around playwright goTo function.
     * Navigates to the specified url
     * @param url
     */
    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
        await logger.info(`Navigated to url : ${url}`);
    }

    /**
     * Enter text into an input field
     * @param cssSelector
     * @param inputText
     */
    async fill(cssSelector: string, inputText: string): Promise<void> {
        await this.page.fill(cssSelector, inputText, {timeout: this.waitTimeout});
    }


    /**
     * Returns total count of elements matching the cssSelector
     * @param cssSelector
     */
    async getCount(cssSelector: string){
        return this.page.locator(cssSelector).count();
    }

    async getText(cssSelector: string): Promise<any>{
         await this.page.waitForSelector(cssSelector);
         return this.page.innerText(cssSelector);
    }

    async saveScreenshot(path: string){
        await this.page.screenshot({fullPage:true,path: path});
    }


    async getInputField(cssSelector: string, index ? : number) {
        return this.page.locator(`${cssSelector} input >> nth=${index}`);
    }

    async selectFromDropdown(cssSelector: string, value: string) {
        await this.page.selectOption(cssSelector, value, {timeout: this.waitTimeout});
    }

    async selectRadioButton(cssSelector: string){
        await this.page.check(cssSelector);
    }

    async reload(){
        await this.page.reload({timeout:this.waitTimeout});

    }

    async isElemVisible(cssSelector: string):Promise<boolean>{
        return this.page.locator(cssSelector).isVisible();
    }

    async keyPress(key:string,numberOfTimes = 1){
        for(let count = 0; count < numberOfTimes; count++){
            await this.page.keyboard.press(key);
        }
    }

    async clickOnElement_ByVisibleText(aSpan: string, s: string) {
        await this.page.locator(`${aSpan}:has-text('${s}')`)
    }

    async selectCheckbox(cssSelector:string){
        await this.page.setChecked(cssSelector, true);
    }

    async wait(timeout:number){
        await this.page.waitForTimeout(timeout);
    }

}