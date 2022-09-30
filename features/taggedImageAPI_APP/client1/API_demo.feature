@API
Feature: API Demo - https://jsonplaceholder.typicode.com

  Scenario: Demo API Test Case - Pass
    When API I send a GET request with url "/todos/1"
    Then API I verify response code is 200
    And  API I verify response json
      | Key       | Value              |
      | userId    | 1                  |
      | id        | 1                  |
      | title     | delectus aut autem |
      | completed | false              |

  Scenario: Demo API Test Case - Fail
    When API I send a GET request with url "/todos/1"
    Then API I verify response code is 200
    And  API I verify response json
      | Key       | Value             |
      | userId    | 2                 |
      | id        | 2                 |
      | title     | delectus au autem |
      | completed | true              |