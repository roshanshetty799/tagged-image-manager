import {BrowserContext, Page} from "playwright";
import {EnvConstants} from "../support/cucumber-world";
import {BasePage} from "./base-page";
import {HomePage} from "./home-page";




export class AllPagesObject {

    basePage : BasePage;
    homePage : HomePage;




    constructor(public page: Page, public context: BrowserContext, env: EnvConstants) {

        this.basePage = new BasePage(page,context,env);
        this.homePage = new HomePage(page,context,env);

    }
}