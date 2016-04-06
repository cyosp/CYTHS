# CYTHS
A 433 MHz Temperature and Humidity Sensor

## Description

CYTHS is a sensor which is able to send through 433 MHz transmitter a temperature thus a humidity value.

These information are coded on 32 bits and transmitted using the RSL protocol each 10 minutes.

Sensor is low energy consumption allowing to have it working several months/years with a single 3.6V battery.

Each sensor has an identifier initialized at the first power on which can be changed if power is unplugged and plugged 3 times in a dedicated time frame.

## Hardware

Sensor is driven by an AVR ATTiny85 microcontroller which is programmed using:
 * The [Tiny AVR Programmer](https://www.sparkfun.com/products/11801)
 * [Arduino IDE](http://www.arduino.org/)

Printed Circuit Board (PCB) has been designed using:
 * [Fritzing software](http://fritzing.org)

### Components

Components used are:

| Description                     | Reference     | Web link |
|:--------------------------------|:--------------|----------|
| Temperature and humidity sensor | DHT22         |          |
| Microcontroller                 | ATTiny85      |          |
| 433 MHz transmitter             |               |          |
| Battery                         | Saft LS 14500 |          |

## Code structure

RSL code is based on 32 bits.

They are organized like this:

| 32-31                     | 30-29                          | 28-25                                 | 24-1                      |
|:--------------------------|:-------------------------------|:--------------------------------------|:--------------------------|
| Remote command identifier | Remote command switch position | Switch state to enable (on/off/onoff) | Remote command identifier |

The 4 bits from 25 to 28 never takes value *1111* thus [CYTHS](https://github.com/cyosp/CYTHS) code is organized like this:

| 32-31         | 30-29            | 28-25 | 24-18     | 17-11    | 10-1        |
|:--------------|:-----------------|:------|:----------|:---------|:------------|
| Battery level | Protocol version | 1111  | Sensor id | Humidity | Temperature |

Where:
 * Battery level
 	* 00 <=> 3.45V
 	* 11 <=> 3.55V

 * Protocol version
 	* 00 <=> First protocol managed and implemented
	It's the one described here

 * 1111
	* Fixed value in order to detect a RSL sensor code

 * Sensor id
	* The sensor identifier
	Value between 1 and 127

 * Humidity
	* Value between 0 and 100
    It matches with the real humidity in %

 * Temperature
	* Value between 0 and 1024
	Real temperature is computed like this:
			T=(Ts-400)/10
    With:
		* T: Real temperature in °C
		* Ts: Temperature coming from sensor
			It means value betwenn 0 and 1024

	At the end it produces the following matching:
		* 0 <=> -40.0 °C
		* ...
		* 40 <=> 0.0 °C
		* ...
		* 1024 <=> 62.4 °C