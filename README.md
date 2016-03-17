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