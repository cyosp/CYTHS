## piTransceiver

[Raspberry Pi](https://www.raspberrypi.org/products/) extension board to receive and transmit to 433MHz.

![piTransceiver-1.0_1](piTransceiver-1.0_1.jpg?raw=true)

![piTransceiver-1.0_2](piTransceiver-1.0_2.jpg?raw=true)

![piTransceiver-1.0_3](piTransceiver-1.0_3.jpg?raw=true)

![piTransceiver-1.0_4](piTransceiver-1.0_4.jpg?raw=true)

![piTransceiver-1.0_5](piTransceiver-1.0_5.jpg?raw=true)

#### PCB

piTransceiver is composed of a double layer PCB:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![piTransceiver-1.0-PCB-F](../../../doc/images/piTransceiver-1.0-PCB-F.png?raw=true "piTransceiver-1.0-PCB-F")&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![piTransceiver-1.0-PCB-B](../../../doc/images/piTransceiver-1.0-PCB-B.png?raw=true "piTransceiver-1.0-PCB-B")

### Components

Components used are:

| Component | Reference                            |
|:----------|:-------------------------------------|
| R1        | 2.2 KΩ 5%                            |
| R2        | 27 Ω 5%                              |
| LED       | Yellow LED                           |
| IC1       | ATtiny85-20PU                        |
| RF1       | 433 MHz transmitter + spring antenna |
| RF2       | 433 MHz receiver + spring antenna    |

#### Configuration

These steps will configure Arduino software in order to use the microcontroller running at 16 Mhz:
 * File -> Preferences
  * In *Additional Boards Manager URLs:*
  * Enter *https://raw.githubusercontent.com/damellis/attiny/ide-1.6.x-boards-manager/package_damellis_attiny_index.json*
  * And *OK* button
 * Tools -> Board-> Boards Manager...
    * Search in the list and select: **attiny** by **David A. Mellis**
    * Click *Install*
    * And *Close* button
 * Tools -> Board-> ATtiny25/45/85
 * Tools -> Processor-> ATtiny85
 * Tools -> Clock-> Internal 16 MHz
 * Tools -> Programmer-> USBtinyISP

Then it's necessary to burn fuses of the microcontroller to set this configuration.
Steps are:
 * Plug a microcontroller on the [Tiny AVR Programmer](https://www.sparkfun.com/products/11801)
 * Plug the [Tiny AVR Programmer](https://www.sparkfun.com/products/11801) to the computer
 * Tools -> Burn Bootloader

