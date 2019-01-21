# 1.4.2 - 2019-01-21
 * Fix: Minimum and maximum battery level was inverted
# 1.4.1 - 2019-01-20
 * Set battery percentage in sensor data
# 1.4.0 - 2019-01-19
 * Log battery percentage value
# 1.3.0 - 2017-03-27
 * Use new API: /API/set/sensor/data/ to store sensor data instead of /API/set/info/
# 1.2.2 - 2017-03-22
 * Update following new configuration file structure
# 1.2.1 - 2016-11-12
 * Add missing 0 for: -.9 <= TEMPERATURE <= .9
# 1.2.0 - 2016-09-30
 * Manage new URL API: /API/set/info/ which replaces /switch/
# 1.1.1 - 2016-09-29
 * Manage cURL return code
# 1.1.0 - 2016-07-16
 * Switch serial port from /dev/ttyACM0 to /dev/ttyAMA0
# 1.0.2 - 2016-07-12
 * Update data format sent to switch URL
# 1.0.1 - 2016-07-08
 * RRD and CSV files moved to /var/lib/cyths base folder
 * Add rrdtool and rrdupdate output to log file
# 1.0.0 - 2016-07-06
 * First version
   Data are retreived using serial port: /dev/ttyACM0