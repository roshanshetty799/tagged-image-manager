/*
 Author      : Roshan S.
 Description : This class contains custom assertion functions which are not not natively available under 'chai' assertion module
*/

import {expect} from 'chai';
import {DataTable} from "@cucumber/cucumber";


export class Assertion {

    private _softAssertMsgs : string = "";

    private get softAssertMsgs(): string {
        return this._softAssertMsgs;
    }

    private set softAssertMsgs(value: string) {
        this._softAssertMsgs = value;
    }

    /**
     * Performs a soft assertion.
     * On failure, instead of halting test execution, it stores all the error messages in
     * class property to be called upon towards the end of the test case by function - softAssertAll
     *
     *
     * @param expected - The data / value expected of the test case
     * @param actual   - The acutal value retrieved during execution
     * @param message  - Message to be displayed on failure
     */
     softAssertEqual(expected:string,actual:string,message:string):void{
        try {
             expect(expected,message).to.equal(actual);
        }catch (e: any) {
             this._softAssertMsgs = this.softAssertMsgs +  e.message + "\n";
        }
    }

    /**
     * Performs a soft assertion. Verifies @expected includes @actual
     * On failure, instead of halting test execution, it stores all the error messages in
     * class property to be called upon towards the end of the test case by function - softAssertAll
     *
     *
     * @param expected - The data / value expected of the test case
     * @param actual   - The acutal value retrieved during execution
     * @param message  - Message to be displayed on failure
     */
    softAssertIncludes(expected:string,actual:string,message:string):void{
        try {
            expect(expected,message).to.include(actual);
        }catch (e: any) {
            this._softAssertMsgs = this.softAssertMsgs +  e.message + "\n";
        }
    }

    /**
     * Performs a soft assertion. Verifies @expected argument returns true
     * On failure, instead of halting test execution, it stores all the error messages in
     * class property to be called upon towards the end of the test case by function - softAssertAll
     *
     *
     * @param expected - The boolean condition
     *
     * @param message - Text to be displayed on failure
     */
    softAssertToBeTrue(expected:boolean,message:string):void{
        try {
            expect(expected,message).to.be.true;
        }catch (e: any) {
            this._softAssertMsgs = this.softAssertMsgs +  e.message + "\n";
        }
    }

    /**
     * Call this at the end of the test case after all the softAssert fuctions have been called.
     * The failures encountered during soft assertions would only be logged if this function is called.
     *
     * @param errorTitle - A short summary of the error messages for logging / reporting purposes
     */
     sofAssertAll(errorTitle:string):void{
         if ( this.softAssertMsgs.length > 0){
             throw new Error(`${errorTitle} \n ${this.softAssertMsgs}`);
         }
    }


    /**
     *  This function can be used compare the expected value in a dataTable form a .feature file vs the actual value contained in the DB column
     *  It performs a soft assertion so that the test case does not stop execution when the first error is detected. Instead, it goes through
     *  all the assertions and lists all the errors post execution.
     *
     *  Needs two arguments : @dataBaseDataTable & @dataFromDataBase
     *
     * @dataBaseDataTable - Only a datatable with two columns would work. The first column would be the DB column and the second it's expected value.
     * @dataFromDatabase - This is an array of queryResult returned from the database. Only the first row of the query result is relevant and is considered for comparison.
     */
    async verifyValueFromDataTableAgainstDatabase(dataTable: DataTable, dataFromDataBase:object) {
        for (let row of dataTable.rows()) {
            // Value retrieved by passing the DB Column name. This is passed from the First column of the datTable
            let actualValue = await dataFromDataBase[row[0]];

            // The Second column consisting of expected value in the DB column
            let expectedValue = row[1];

            await this.softAssertEqual((expectedValue.toString()).trim(),(actualValue.toString()).trim(),
                `Expected DB Column : ${row[0]} to contain value : ${(expectedValue.toString()).trim()}
             however found ${(actualValue.toString())}`);

        }
        await this.sofAssertAll(`Multiple Assertion Failures. Expected value(s) not found in Database Table(s)`);
    }
}