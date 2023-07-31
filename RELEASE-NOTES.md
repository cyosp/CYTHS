Release notes
-------------
##### 6.3.0 (2023-07-31)
* Add arm64v8 container image generation

##### 6.2.0 (2023-07-31)
 * Automate container image generation
 * cyths-receiver: Check ttyS1 availability if ttyAMA0 doesn't exist

##### 6.1.1 (2023-07-22)
 * Fix: Display all sensors graph instead of the asked one

##### 6.1.0 (2023-07-22)
 * Add endpoint to update CYTHS value

##### 6.0.0 (2023-07-20)
 * Move to container packaging

##### 5.0.1 (2023-07-17)
 * Fix: Incorrect require path for JSONPath library

##### 5.0.0 (2023-07-15)
 * /!\ Crontab condition breaking change /!\
   - Condition expression move from NodeJS/json-query to PHP/JSONPath
   - Comparison operators move from: gt, ge, ... to standard ones: >, >=, ...
   - Restrict JSON path evaluation to left condition side
 * Dependency changes:
   * Remove NodeJS
   * PHP >= 8.0
 * Log received code as decimal value
