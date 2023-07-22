Release notes
-------------
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
