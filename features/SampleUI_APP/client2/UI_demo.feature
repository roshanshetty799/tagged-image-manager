@UI
Feature: UI Demo

  Scenario: UI Demo
    Given UI I am on Sample APP
    # SlowMo has been set to 1s in config so that the navigation is visible to the eye
    Then  UI I go to "overview > news > challenges" page



