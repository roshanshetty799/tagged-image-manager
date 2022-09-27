/*
* Author      : Roshan S.
* Description : This file contain configuration details and functions to query/update the SQL database.
* */

import * as assert from "assert";
import {SqlClient} from "msnodesqlv8";
import {EnvConstants} from "../support/cucumber-world";


export class SqlDriver {

    connectionString: string;
    sql: SqlClient;



    constructor(env: EnvConstants) {
        this.connectionString = `server=${env.ENV_CONFIG[env.APP][env.CLIENT][env.HOST].sqlServer};Database=${env.ENV_CONFIG[env.APP][env.CLIENT][env.HOST].database};Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}`;
        this.sql = require("msnodesqlv8");

    }

    /**
     *  Queries the database and returns the first row from the response as an object.
     *
     *  @query - A valid SQL query
     *  @errorMessage - Error message to be displayed is the returned response is empty
     *
     *  @return - Returns the first row from the response as an object as a Key (column Name) : Value (correponding data) pair.
     *
     */

    async runSqlQueryAndReturnResult(query: string, errorMessage: string): Promise<object> {
        return new Promise((resolve, reject) => {

            this.sql.query(this.connectionString, query, (err, rows) => {

                // Throws error if connection to the database is unsuccessful
                assert.ifError(err);

                    (rows!.length < 1) ? reject(`SQL Error - Unable to retrive the following from the Database : ${errorMessage}`) : resolve(rows![0]);

            });
        });
    }

    /**
     *  Updates the database table and only returns an error if the update fails.
     *
     *  @query - A valid SQL query
     *  @errorMessage - Error message to be displayed is the update fails
     *
     *  @return - Returns void is the update is successful otherwise returns the appropriate error message.
     *
     */
     async runUpdateSqlQuery(query: string, errorMessage: string) {

        return new Promise((resolve, reject) => {

            this.sql.query(this.connectionString, query, (err, res) => {
                // Throws error if connection to the database is unsuccessful
                assert.ifError(err);
                err ? reject(`${err} SQL Error - Unable to update the following in the Database : ${errorMessage}`) : resolve(res![0]);

            });
        });
    }

    /**
     *  Queries the database and returns the first row from the response as an object.
     *
     *  @query - A valid SQL query
     *  @errorMessage - Error message to be displayed is the returned response is empty
     *
     *  @return - Returns all rows from the response as an array, with each row as object - Key (column Name) : Value (corresponding data) pair.
     *
     */
    async runSqlQueryAndReturnResult_allRows (query: string, errorMessage: string): Promise<object[]>{

        return new Promise((resolve, reject) => {

            this.sql.query(this.connectionString, query, (err, rows) => {

                // Throws error if connection to the database is unsuccessful
                assert.ifError(err);

                (rows!.length < 1) ? reject(`SQL Error - Unable to retrieve the following from the Database : ${errorMessage}`) : resolve(rows!);

            });
        });
    }

}



