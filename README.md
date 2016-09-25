# CYTHS

A 433 MHz Temperature and Humidity Solution

This project is divided in several parts:
 * [A sensor](hardware/sensor/V 2.0) which measures and sends temperature and humidity

 ![CYTHS-2.0_1](hardware/sensor/V 2.0/CYTHS-2.0_1.jpg?raw=true)

 * [A hardware](hardware/piTransceiver/V 1.0) part connected to a [Raspberry Pi](https://www.raspberrypi.org/products/) in order to:
    * Receive sensors information
    * Drive RSL switch connected to electric heaters

    ![piTransceiver-1.0_1](hardware/piTransceiver/V 1.0/piTransceiver-1.0_1.jpg?raw=true)


 * A software part hosted by the [Raspberry Pi](https://www.raspberrypi.org/products/) which:
    * Drives RSL switches

        ![software-main-web-page](doc/images/software-main-web-page.png?raw=true "software-main-web-page")

    * Stores sensors data received

        ![software-sensor-graph](doc/images/software-sensor-graph.png?raw=true "software-sensor-graph")

## License

**[CYTHS](https://github.com/cyosp/CYTHS)** is released under the BSD 3-Clause License.

See the bundled `LICENSE.md` for details.
