import {CustomWorld} from "../support/cucumber-world";
import {DataTable, When} from "@cucumber/cucumber";
import {expect} from "chai";
import {Assertion} from "../drivers/assertion";



When('API I send a GET request with url {string}', async function (this: CustomWorld,url :string) {

    this.response = await this.apiDriver!.get(url);
});

When('API I verify response code is {int}', async function (this: CustomWorld,responseCode :number) {

    expect(this.response?.status()).to.equal(responseCode);
});

When('API I verify response json', async function (this: CustomWorld,dataTable : DataTable) {

    const resJson = await this.response?.json()
    const assert = new Assertion();
    for(const row of dataTable.rows()){
        assert.softAssertEqual(resJson[row[0]].toString(),row[1],
            `Expected Key : ${row[0]} to contain value : ${row[1]} however found ${resJson[row[0]]}`);
    }

    assert.sofAssertAll(`Discrepancies found between expected Json value vs actual`);
});


