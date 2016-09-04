# CYTHS

A 433 MHz Temperature and Humidity Solution

This project is divided in several parts:
 * A sensor which measures and sends temperature and humidity

 ![CYTHS-2.0-PCB-F](doc/images/CYTHS-2.0-PCB-F.png?raw=true "CYTHS-2.0-PCB-F")&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![CYTHS-2.0-PCB-B](doc/images/CYTHS-2.0-PCB-B.png?raw=true "CYTHS-2.0-PCB-B")

 * A hardware part connected to a [Raspberry Pi](https://www.raspberrypi.org/products/) in order to:
    * Receive sensors information
    * Drive RSL switch connected to electric heaters

    ![piTransceiver-1.0-PCB-F](doc/images/piTransceiver-1.0-PCB-F.png?raw=true "piTransceiver-1.0-PCB-F")&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![piTransceiver-1.0-PCB-B](doc/images/piTransceiver-1.0-PCB-B.png?raw=true "piTransceiver-1.0-PCB-B")


 * A software part hosted by the [Raspberry Pi](https://www.raspberrypi.org/products/) which:
    * Drives RSL switches

        ![software-main-web-page](doc/images/software-main-web-page.png?raw=true "software-main-web-page")

    * Stores sensors data received

        ![software-sensor-graph](doc/images/software-sensor-graph.png?raw=true "software-sensor-graph")

## License

**[CYTHS](https://github.com/cyosp/CYTHS)** is released under the BSD 3-Clause License.

See the bundled `LICENSE.md` for details.
