## 433 MHz Temperature and Humidity Sensor

![Stable version](https://img.shields.io/badge/stable-2.0.0-blue.svg)
[![BSD-3 license](https://img.shields.io/badge/license-BSD--3--Clause-428F7E.svg)](https://tldrlegal.com/license/bsd-3-clause-license-%28revised%29)

![CYTHS-2.0_1](CYTHS-2.0_1.jpg?raw=true)

![CYTHS-2.0_2](CYTHS-2.0_2.jpg?raw=true)

![CYTHS-2.0_3](CYTHS-2.0_3.jpg?raw=true)

### Description

CYTHS is a sensor which is able to send through 433 MHz transmitter a temperature thus a humidity value.

These information are coded on 32 bits and transmitted using the RSL protocol each 5 minutes.

Sensor is low energy consumption allowing to have it working around 1000 days (~2.8 years) with three 1.5V batteries.

Each sensor has an identifier initialized at the first power on which can be changed if power is unplugged and plugged 3 times in a dedicated time frame.

### Lifetime

Sensor lifetime is calculated using [Oregon Embedded](http://oregonembedded.com/batterycalc.htm) web site and the following information:

| Description                                     | Value |
|:------------------------------------------------|:------|
| Capacity rating of battery (mAh)                | 1250  |
| Current consumption of device during sleep (mA) | 0.02  |
| Current consumption of device during wake (mA)  | 15    |
| Number of wakeups per hour                      | 11    |
| Duration of wake time (ms)                      | 500   |

Estimated battery life is: **1032.29 days, or 2.83 years**.

### Hardware

Sensor is driven by an AVR ATtiny85 microcontroller which is programmed using:
 * The [Tiny AVR Programmer](https://www.sparkfun.com/products/11801)
 * [Arduino IDE](http://www.arduino.org/)

Printed Circuit Board (PCB) has been designed using:
 * [KiCad](http://kicad-pcb.org)

#### PCB

Sensor is composed of a double layer PCB:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![CYTHS-2.0-PCB-F](CYTHS-2.0-PCB-F.png?raw=true "CYTHS-2.0-PCB-F")&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![CYTHS-2.0-PCB-B](CYTHS-2.0-PCB-B.png?raw=true "CYTHS-2.0-PCB-B")

#### Components

Components used are:

| Description                     | Reference                                                                                                         | Power voltage (V) |
|:--------------------------------|:------------------------------------------------------------------------------------------------------------------|------------------|
| Temperature and humidity sensor | [DHT22](https://www.waveshare.com/wiki/DHT22_Temperature-Humidity_Sensor)                                         | 3.3 → 6          |
| Microcontroller                 | [ATTINY85-20SU](https://www.microchip.com/en-us/product/attiny85)                                                 | 2.7 → 5.5        |
| 433 MHz transmitter             | [433 MHz transmitter](https://microcontrollerslab.com/433mhz-rf-transmitter-module-pinout-examples-applications/) | 3.3 → 12         |
| 3x 1.5V AAA batteries           | [Camelion batteries](http://camelionbatteries.com/primary/plus.html)                                              | 1.5              |

### Code structure

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
 	* 00 <=> 4.35V
 	* 11 <=> 4.86V

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

### Arduino

#### Dependency libraries installation
1. **DHTlib**
   * Sketch → Include Library → Manage Libraries
   * Search **DHTlib** by *Rob Tillaart*
   * Latest version is: *0.1.35* the *2022-08-04*
   * Click *Install*
2. **PinChangeInterrupt**
   * Sketch → Include Library → Manage Libraries 
   * Search **PinChangeInterrupt** by *NicoHood*
   * Latest version is: *1.2.9* the *2022-08-04*
   * Click *Install*
3. **rc-switch** by *CYOSP*
   * Download https://github.com/cyosp/rc-switch/archive/refs/tags/v2.52.1.zip
   * Sketch → Include Library → Add .ZIP Library...
   * Then choose the downloaded ZIP file

#### Configuration

These steps will configure Arduino software in order to use the microcontroller running at 16 Mhz:
 * File → Preferences
  * In *Additional Boards Manager URLs:*
  * Enter *https://raw.githubusercontent.com/damellis/attiny/ide-1.6.x-boards-manager/package_damellis_attiny_index.json*
  * And *OK* button
 * Tools → Board → Boards Manager...
    * Search in the list and select: **attiny** by **David A. Mellis**
    * Click *Install*
    * And *Close* button
 * Tools → Board → ATtiny25/45/85
 * Tools → Processor → ATtiny85
 * Tools → Clock → **Internal** 8 MHz

#### Setup programmer

Here is used [Tiny AVR Programmer](https://www.sparkfun.com/products/11801) and it means:
 * Tools → Programmer → USBtinyISP 
 * Wire the microcontroller with the programmer board:

   ![CYTHS-2.0-Programmer-wired](CYTHS-2.0-Programmer-wired.png?raw=true)

   **/!\ Photo displays sensor bottom side /!\\**

 * Plug the programmer board to the computer

#### Code upload

It's necessary to burn fuses of the microcontroller to set this configuration:
 * Tools → Burn Bootloader

Output example of burn bootloader in verbose mode:
```
/Applications/Arduino.app/Contents/Java/hardware/tools/avr/bin/avrdude -C/Applications/Arduino.app/Contents/Java/hardware/tools/avr/etc/avrdude.conf -v -v -v -v -pattiny85 -cusbtiny -e -Uefuse:w:0xff:m -Uhfuse:w:0xdf:m -Ulfuse:w:0xe2:m 

avrdude: Version 6.3-20190619
         Copyright (c) 2000-2005 Brian Dean, http://www.bdmicro.com/
         Copyright (c) 2007-2014 Joerg Wunsch

         System wide configuration file is "/Applications/Arduino.app/Contents/Java/hardware/tools/avr/etc/avrdude.conf"
         User configuration file is "/Users/cyosp/.avrduderc"
         User configuration file does not exist or is not a regular file, skipping

         Using Port                    : usb
         Using Programmer              : usbtiny
avrdude: usbdev_open(): Found USBtinyISP, bus:device: 000:005
         AVR Part                      : ATtiny85
         Chip Erase delay              : 400000 us
         PAGEL                         : P00
         BS2                           : P00
         RESET disposition             : possible i/o
         RETRY pulse                   : SCK
         serial program mode           : yes
         parallel program mode         : yes
         Timeout                       : 200
         StabDelay                     : 100
         CmdexeDelay                   : 25
         SyncLoops                     : 32
         ByteDelay                     : 0
         PollIndex                     : 3
         PollValue                     : 0x53
         Memory Detail                 :

                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           eeprom        65    12     4    0 no        512    4      0  4000  4500 0xff 0xff
                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           flash         65     6    32    0 yes      8192   64    128 30000 30000 0xff 0xff
                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           signature      0     0     0    0 no          3    0      0     0     0 0x00 0x00
                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           lock           0     0     0    0 no          1    0      0  9000  9000 0x00 0x00
                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           lfuse          0     0     0    0 no          1    0      0  9000  9000 0x00 0x00
                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           hfuse          0     0     0    0 no          1    0      0  9000  9000 0x00 0x00
                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           efuse          0     0     0    0 no          1    0      0  9000  9000 0x00 0x00
                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           calibration    0     0     0    0 no          1    0      0     0     0 0x00 0x00

         Programmer Type : USBtiny
         Description     : USBtiny simple USB programmer, https://learn.adafruit.com/usbtinyisp
avrdude: programmer operation not supported

avrdude: Using SCK period of 10 usec
CMD: [ac 53 00 00] [00 00 53 00]
avrdude: AVR device initialized and ready to accept instructions

Reading | CMD: [30 00 00 00] [00 30 00 1e]
CMD: [30 00 01 00] [00 30 00 93]
################CMD: [30 00 02 00] [00 30 00 0b]
################################## | 100% 0.01s

avrdude: Device signature = 0x1e930b (probably t85)
avrdude: erasing chip
CMD: [ac 80 00 00] [00 ac 80 00]
avrdude: Using SCK period of 10 usec
CMD: [ac 53 00 00] [00 ac 53 00]
avrdude: reading input file "0xff"
avrdude: writing efuse (1 bytes):

/Applications/Arduino.app/Contents/Java/hardware/tools/avr/bin/avrdude -C/Applications/Arduino.app/Contents/Java/hardware/tools/avr/etc/avrdude.conf -v -v -v -v -pattiny85 -cusbtiny 

avrdude: Version 6.3-20190619
         Copyright (c) 2000-2005 Brian Dean, http://www.bdmicro.com/
         Copyright (c) 2007-2014 Joerg Wunsch

         System wide configuration file is "/Applications/Arduino.app/Contents/Java/hardware/tools/avr/etc/avrdude.conf"
         User configuration file is "/Users/cyosp/.avrduderc"
         User configuration file does not exist or is not a regular file, skipping

         Using Port                    : usb
         Using Programmer              : usbtiny
avrdude: usbdev_open(): Found USBtinyISP, bus:device: 000:005
         AVR Part                      : ATtiny85
         Chip Erase delay              : 400000 us
         PAGEL                         : P00
         BS2                           : P00
         RESET disposition             : possible i/o
         RETRY pulse                   : SCK
         serial program mode           : yes
         parallel program mode         : yes
         Timeout                       : 200
         StabDelay                     : 100
         CmdexeDelay                   : 25
         SyncLoops                     : 32
         ByteDelay                     : 0
         PollIndex                     : 3
         PollValue                     : 0x53
         Memory Detail                 :

                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           eeprom        65    12     4    0 no        512    4      0  4000  4500 0xff 0xff
                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           flash         65     6    32    0 yes      8192   64    128 30000 30000 0xff 0xff
                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           signature      0     0     0    0 no          3    0      0     0     0 0x00 0x00
                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           lock           0     0     0    0 no          1    0      0  9000  9000 0x00 0x00
                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           lfuse          0     0     0    0 no          1    0      0  9000  9000 0x00 0x00
                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           hfuse          0     0     0    0 no          1    0      0  9000  9000 0x00 0x00
                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           efuse          0     0     0    0 no          1    0      0  9000  9000 0x00 0x00
                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           calibration    0     0     0    0 no          1    0      0     0     0 0x00 0x00

         Programmer Type : USBtiny
         Description     : USBtiny simple USB programmer, https://learn.adafruit.com/usbtinyisp
avrdude: programmer operation not supported

avrdude: Using SCK period of 10 usec
Writing | CMD: [50 08 00 00] [00 50 08 ff]
################################################## | 100% 0.00s

avrdude: 1 bytes of efuse written
avrdude: verifying efuse memory against 0xff:
avrdude: load data efuse data from input file 0xff:
avrdude: input file 0xff contains 1 bytes
avrdude: reading on-chip efuse data:

Reading | CMD: [50 08 00 00] [00 50 08 ff]
################################################## | 100% 0.00s

avrdude: verifying ...
avrdude: 1 bytes of efuse verified
avrdude: reading input file "0xdf"
avrdude: writing hfuse (1 bytes):

Writing | CMD: [58 08 00 00] [00 58 08 df]
################################################## | 100% 0.00s

avrdude: 1 bytes of hfuse written
avrdude: verifying hfuse memory against 0xdf:
avrdude: load data hfuse data from input file 0xdf:
avrdude: input file 0xdf contains 1 bytes
avrdude: reading on-chip hfuse data:

Reading | CMD: [58 08 00 00] [00 58 08 df]
################################################## | 100% 0.00s

avrdude: verifying ...
avrdude: 1 bytes of hfuse verified
avrdude: reading input file "0xe2"
avrdude: writing lfuse (1 bytes):

Writing | CMD: [50 00 00 00] [00 50 00 f1]
CMD: [ac a0 00 e2] [00 ac a0 00]
CMD: [50 00 00 00] [e2 50 00 ff]
CMD: [50 00 00 00] [00 50 00 e2]
################################################## | 100% 0.01s

avrdude: 1 bytes of lfuse written
avrdude: verifying lfuse memory against 0xe2:
avrdude: load data lfuse data from input file 0xe2:
avrdude: input file 0xe2 contains 1 bytes
avrdude: reading on-chip lfuse data:

Reading | CMD: [50 00 00 00] [00 50 00 e2]
################################################## | 100% 0.00s

avrdude: verifying ...
avrdude: 1 bytes of lfuse verified

avrdude done.  Thank you.

CMD: [ac 53 00 00] [00 00 53 00]
avrdude: AVR device initialized and ready to accept instructions

Reading | CMD: [30 00 00 00] [00 30 00 1e]
CMD: [30 00 01 00] [00 30 00 93]
################CMD: [30 00 02 00] [00 30 00 0b]
################################## | 100% 0.01s

avrdude: Device signature = 0x1e930b (probably t85)

avrdude done.  Thank you.
```

Then **Upload** button of Arduino IDE can be used to upload code to the microcontroller.

Output example of an upload in verbose mode:
```
Sketch uses 5086 bytes (62%) of program storage space. Maximum is 8192 bytes.
Global variables use 218 bytes (42%) of dynamic memory, leaving 294 bytes for local variables. Maximum is 512 bytes.
/Applications/Arduino.app/Contents/Java/hardware/tools/avr/bin/avrdude -C/Applications/Arduino.app/Contents/Java/hardware/tools/avr/etc/avrdude.conf -v -pattiny85 -cusbtiny -Uflash:w:/var/folders/0m/mk12ygtj6vvc6_7bwsyj_v5w0000gp/T/arduino_build_649299/CYTHS.ino.hex:i 

avrdude: Version 6.3-20190619
         Copyright (c) 2000-2005 Brian Dean, http://www.bdmicro.com/
         Copyright (c) 2007-2014 Joerg Wunsch

         System wide configuration file is "/Applications/Arduino.app/Contents/Java/hardware/tools/avr/etc/avrdude.conf"
         User configuration file is "/Users/cyosp/.avrduderc"
         User configuration file does not exist or is not a regular file, skipping

         Using Port                    : usb
         Using Programmer              : usbtiny
avrdude: usbdev_open(): Found USBtinyISP, bus:device: 000:005
         AVR Part                      : ATtiny85
         Chip Erase delay              : 400000 us
         PAGEL                         : P00
         BS2                           : P00
         RESET disposition             : possible i/o
         RETRY pulse                   : SCK
         serial program mode           : yes
         parallel program mode         : yes
         Timeout                       : 200
         StabDelay                     : 100
         CmdexeDelay                   : 25
         SyncLoops                     : 32
         ByteDelay                     : 0
         PollIndex                     : 3
         PollValue                     : 0x53
         Memory Detail                 :

                                  Block Poll               Page                       Polled
           Memory Type Mode Delay Size  Indx Paged  Size   Size #Pages MinW  MaxW   ReadBack
           ----------- ---- ----- ----- ---- ------ ------ ---- ------ ----- ----- ---------
           eeprom        65    12     4    0 no        512    4      0  4000  4500 0xff 0xff
           flash         65     6    32    0 yes      8192   64    128 30000 30000 0xff 0xff
           signature      0     0     0    0 no          3    0      0     0     0 0x00 0x00
           lock           0     0     0    0 no          1    0      0  9000  9000 0x00 0x00
           lfuse          0     0     0    0 no          1    0      0  9000  9000 0x00 0x00
           hfuse          0     0     0    0 no          1    0      0  9000  9000 0x00 0x00
           efuse          0     0     0    0 no          1    0      0  9000  9000 0x00 0x00
           calibration    0     0     0    0 no          1    0      0     0     0 0x00 0x00

         Programmer Type : USBtiny
         Description     : USBtiny simple USB programmer, https://learn.adafruit.com/usbtinyisp
avrdude: programmer operation not supported

avrdude: Using SCK period of 10 usec
avrdude: AVR device initialized and ready to accept instructions

Reading | ################################################## | 100% 0.01s

avrdude: Device signature = 0x1e930b (probably t85)
avrdude: NOTE: "flash" memory has been specified, an erase cycle will be performed
         To disable this feature, specify the -D option.
avrdude: erasing chip
avrdude: Using SCK period of 10 usec
avrdude: reading input file "/var/folders/0m/mk12ygtj6vvc6_7bwsyj_v5w0000gp/T/arduino_build_649299/CYTHS.ino.hex"
avrdude: writing flash (5086 bytes):

Writing | ################################################## | 100% 8.46s

avrdude: 5086 bytes of flash written
avrdude: verifying flash memory against /var/folders/0m/mk12ygtj6vvc6_7bwsyj_v5w0000gp/T/arduino_build_649299/CYTHS.ino.hex:
avrdude: load data flash data from input file /var/folders/0m/mk12ygtj6vvc6_7bwsyj_v5w0000gp/T/arduino_build_649299/CYTHS.ino.hex:
avrdude: input file /var/folders/0m/mk12ygtj6vvc6_7bwsyj_v5w0000gp/T/arduino_build_649299/CYTHS.ino.hex contains 5086 bytes
avrdude: reading on-chip flash data:

Reading | ################################################## | 100% 12.97s

avrdude: verifying ...
avrdude: 5086 bytes of flash verified

avrdude done.  Thank you.
```
