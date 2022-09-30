
import {CustomWorld} from "../support/cucumber-world";
import {When} from "@cucumber/cucumber";

When(/**
 To navigate to the desired page, pass the href value of the page. If you
 wish to navigate to multiple pages, separate the page names by '>'
 */'UI I go to {string} page', async function (this: CustomWorld, pageName: string) {

    let pages = pageName.split('>');
    if(pages.length > 1) {
        for(let page of pages){
            await this.pagesObj?.basePage.goToPage(page.trim());
        }
    }else {
        await this.pagesObj?.basePage.goToPage(pageName);
    }
});

When('UI I am on Sample APP', async function (this: CustomWorld){

    await this.pagesObj?.basePage.driver.navigateTo(this.env.ENV_CONFIG[this.env.APP][this.env.CLIENT][this.env.HOST].baseURL);
});


