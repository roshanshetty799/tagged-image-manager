import {generateHtmlReport, post_Report_To_TestRail, send_SlackNotification} from "./src/support/generate-report";

(async ()=>{
    await generateHtmlReport();
    await send_SlackNotification();
    await post_Report_To_TestRail();
})()