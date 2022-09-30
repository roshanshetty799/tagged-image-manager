# tagged-image-manager-challenge

## Description
    This Test Automation Framework makes it possible to run E2E UI & API scenarios across different Clients/ Hosts.
    The foundations of the framework are built upon two open source tools Playwright and
    Cucumber. Playwright allows you to interact with the browser like a user would and 
    Cucumber helps organising the test scenarios in an easy readable format. Playwright also supports API calls. 
     
### Project Overview

      
        ├── reports                # Contains E2E run report. This dir is not checked in. Report generated after run can be found here 
                                     Report will be further categorised into dir(s) of it's respective Client / Host and by Date / Time
        ├── src                    
        │   ├── drivers            # Native calls are wrapped in custom classes. This practice makes it easy to replace redundant packages.
        │   ├── hooks              # Functions/Calls to be made before/after scenarios are stored here
        │   ├── pages              # Element locators and functions to perform actions on the application
        │   ├── step-definitions   # Cucumber Step definitions are detailed here
        │   ├── support            # Contains Cucumber global parameters & Report Implementation
        │   ├── testData           # Any persistent Test Data can be placed here. 
        │   ├── utils              # Helper functions for the framework
        │   └── wrappers           # Native functions for browser,SQL Driver etc. are wrapped in a custom function                
        
        ├── cucumber.js            # Cucumber run config
        └── ...
        
### Quick Start 

Pre-requisite:
     
- [NodeJS](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/downloads)
     

Running E2E test suite - runs the Demo API test cases 

```shell
cp envConfig.json.example envConfig.json
APP=taggedImageAPI_APP CLIENT=CLIENT1 HOST=DEV1 npm run e2e --tags="@API" --retry=0 --parallel=0
```

Installs all the required dependencies and runs the two Demo API test cases under 
features > API_Demo.feature. Post run, a html report will be created and open automatically 
in the browser. Reports generated can be found under 'reports' dir


Running the Sample UI Demo test 

```shell
APP=SampleUI_APP CLIENT=CLIENT1 HOST=DEV1 npm run e2e --tags="@UI" --retry=0 --parallel=0
```

This should run the only scenario under SampleUI_APP feature to showcase what a UI run looks like.



 
## Walkthrough of the project and notes

- I have covered the smoke testing scenarios as part of the task in 'SmokeTesting.feature'. They are 
skeletal only and do not actually run. I tried setting up the challenge project however running into config issues. It imports
AWS related dependencies and I have yet to dip my toe in AWS in the interest of saving time, I thought it best to 
setup an E2E framework so that you can assess my coding / framework knowledge and the skeletal test cases would give you an idea of 
the test cases I would have covered if I had more time on my hands. 

- For API I wouldn't necessarily wrap things in a BDD framework as playwright itself supports API
testing out of the box however wanted to showcase a BDD framework which can be used for UI and API 
testing. This one is ready to go and is capable of running against different clients /environments.
Also combined UI and API test frameworks helps us build test cases where we ensure data integrity and consistency 
between the UI and API, if required. 

- One benefit of having Cucumber driving your testing is, you are not dependant on the open source 
package of your choice staying relevant. As you can observe in the 'drivers' dir, they are all wrapped 
in a custom class and can be easily replaced with any package of your choice. 



      
  
