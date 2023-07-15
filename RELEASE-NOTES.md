Release notes
-------------
##### 5.0.0 (2023-07-15)
 * /!\ Crontab condition breaking change /!\
   - Condition expression move from NodeJS/json-query to PHP/JSONPath
   - Comparison operators move from: gt, ge, ... to standard ones: >, >=, ...
   - Restrict JSON path evaluation to left condition side
 * Dependency changes:
   * Remove NodeJS
   * PHP >= 8.0
 * Log received code as decimal value
