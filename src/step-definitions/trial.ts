import {CustomWorld} from "../support/cucumber-world";
import {When} from "@cucumber/cucumber";


When('Just a test', async function (this: CustomWorld) {
   await console.log('Just a test called');
});

When('a when test', async function (this: CustomWorld) {
    await console.log('a when test called');
});

When('a then test', async function (this: CustomWorld) {
    await console.log('a then test called');
});