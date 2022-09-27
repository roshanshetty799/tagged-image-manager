/*
 Author      : Roshan S.
 Description : This file contains configuration details for Test Execution Report creation.
*/


import {dateUtil} from "../utils/dateUtil";
import {fileSystemUtils} from "../utils/fileSystemUtil";
import {logger} from "../drivers/logger";
import * as process from "process";
import * as os from "os";


const reportGenDate = dateUtil.getCurrentDate_OR_AND_Time('Do MMM YYYY');
const reportGenTime = dateUtil.getCurrentDate_OR_AND_Time('h.mm.ss A');
const report = require('multiple-cucumber-html-reporter');
const testRail_API = require("testrail-api");
const APP = process.env.APP!;
const CLIENT = process.env.CLIENT!;
const HOST = process.env.HOST!;
const REPORTPATH = `${process.env.REPORTPATH ? process.env.REPORTPATH : 'reports'}/${APP}/${CLIENT}/${HOST}/${reportGenDate}/${reportGenTime}`;
const JENKINSBUILD = process.env.JENKINSBUILD;
const JENKINSUSER = process.env.JENKINSUSER;
const TESTRAILRUNID = process.env.TESTRAILRUNID;
const ENVCONFIG = JENKINSBUILD ? require('C:/Test_Automation/envConfig.json') : require('../../envConfig.json');


/**
 *  Generates an html report by reading the report.json file
 *  located under reports/APP/Client/ which gets created post e2e execution
 */
export const generateHtmlReport = async () => {
    await fileSystemUtils.createNewDir(REPORTPATH);

    await fileSystemUtils.moveFile(`reports/report.json`,
        `${REPORTPATH}/report.json`);

    await fileSystemUtils.checkIfExistsWithTimeout(`${REPORTPATH}/report.json`, 30000, `report.json file not found at ${REPORTPATH}`);

    await report.generate({
        jsonDir: REPORTPATH,
        reportPath: REPORTPATH,
        openReportInBrowser: true,
        reportName: `${APP} E2E Automation report : ${CLIENT} - ${HOST}`,
        pageTitle: 'Automation report',
        pageFooter: '<div><p> Custom footer test </p></div>',
        displayDuration: true,
        durationInMs: true,

        metadata: {
            // browser: {
            //     name:
            //     version:
            // },
            device: `${os.hostname}`,
            platform: {
                name: os.platform(),
                version: os.version()
            }
        }
    });

}

export const send_SlackNotification = async () => {

    if (JENKINSBUILD) {

        const axios = require('axios')

        const getRandomColor = () => Math.floor(Math.random() * 16777215).toString(16);
        const slackNotificationColor = getRandomColor();

        await axios
            .post(ENVCONFIG['slack']['webhook_URL'], {

                "attachments": [
                    {
                        "color": slackNotificationColor,
                        "text": `${JENKINSBUILD} Finished run by <@${JENKINSUSER}> 
                    \n(<Report_URL>)`
                    }
                ]

            })
            .then(() => {
                console.log(`Slack Notification Sent Successfully.`)
            })
            .catch((error: Error) => {
                console.error(`Failed to send Slack Notification. Error: ${error}`)
            })
    } else {
        await logger.info(`Slack notifications are only sent for a Jenkins run`);
    }

}

/**
 Parses the current run's report.json file and returns json object for Test Rail reporting
 */
const update_TestRail_Report_Json = async (): Promise<object[]> => {
    let testRail_Report_Json: object[] = []
    let jsonReportFile = `${REPORTPATH}/report.json`;

    let cucumber_Report_Json = await JSON.parse(fileSystemUtils.readFile(jsonReportFile));
    await cucumber_Report_Json.forEach((feature: { [x: string]: any; }) => {
        (feature['elements']).forEach((elem: { [x: string]: any; }) => {

            let cucumber_CaseID_tag;
            let testCase_ID: number = 0;
            for (let tag of elem['tags']) {
                if (tag['name'].includes('@CaseID')) {
                    cucumber_CaseID_tag = tag['name'];
                    testCase_ID = Number(cucumber_CaseID_tag.substring(9, cucumber_CaseID_tag.length));
                }
            }

            let status_ID: number = 1;
            let comment: string = "";
            let steps = elem['steps'];

            for (let stepIndex = 1; stepIndex < steps.length - 2; stepIndex++) {
                let step = steps[stepIndex];
                if (step['result']['status'] === 'failed') {
                    status_ID = 5;
                    comment = comment.concat(`${step["keyword"]} ${step["name"]} : ${(step['result']['status']).toUpperCase()} \n \n
                 Error Message : ${step['result']['error_message']} `);
                } else {
                    comment = comment.concat(`${step["keyword"]} ${step["name"]} : ${(step['result']['status']).toUpperCase()} \n \n`);
                }
            }
            if (testCase_ID !== 0) {
                testRail_Report_Json.push({
                    "case_id": testCase_ID,
                    "status_id": status_ID,
                    "comment": comment
                });
            }

        });
    })


    return testRail_Report_Json;
}


/**
 *  If a valid testRailRunId is specified during run then the result will be reported to test rail
 *  Example : --testRailRunId <runID>
 */
export const post_Report_To_TestRail = async () => {

    if (!TESTRAILRUNID) {
        await logger.info(`Test Rail reporting is turned off. Pass valid 'TESTRAILRUNID' as env variable to enable Test rail reporting.`)
    } else {


        const testRail_ID = ENVCONFIG['testRail']['userID'];
        const testRail_API_Key = ENVCONFIG['testRail']['API_Key'];
        const testRail_host = ENVCONFIG['testRail']['host'];

        let runId = Number(TESTRAILRUNID);

        let testRail_Report_Json = await update_TestRail_Report_Json();


        await new testRail_API({
            host: testRail_host,
            user: testRail_ID,
            password: testRail_API_Key
        }).addResultsForCases(runId, testRail_Report_Json, function (err: Error) {
            if (err === null) {
                logger.info(`Run report successfully published to TestRail`);
            } else {
                logger.error(`Failed to publish report to Test Rail.
            Error Message : ${JSON.stringify(err)}`);
            }
        })


    }
}



















