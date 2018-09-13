# CYTHS

A 433 MHz Temperature and Humidity Solution

This project is divided in several parts:
 * [A sensor](hardware/sensor/V2.0) which measures and sends temperature and humidity

 ![CYTHS-2.0_1](hardware/sensor/V2.0/CYTHS-2.0_1.jpg?raw=true)

 * [A hardware](hardware/piTransceiver/V1.0) part connected to a [Raspberry Pi](https://www.raspberrypi.org/products/) in order to:
    * Receive sensors information
    * Drive RSL switch connected to electric heaters

    ![piTransceiver-1.0_1](hardware/piTransceiver/V1.0/piTransceiver-1.0_1.jpg?raw=true)


 * A software part hosted by the [Raspberry Pi](https://www.raspberrypi.org/products/) which:
    * Drives RSL switches

        ![software-main-web-page](doc/images/software-main-web-page.png?raw=true "software-main-web-page")

    * Stores sensors data received

        ![software-sensor-graph](doc/images/software-sensor-graph.png?raw=true "software-sensor-graph")

    * Allow to schedule RSL switches change

        ![software-scheduler-page](doc/images/software-scheduler-page.png?raw=true "software-scheduler-page")
        
    * Allow to associate and dissociate switches 
        
        ![software-admin-page](doc/images/software-admin-page.png?raw=true "software-admin-page")

## Hardware requirement

[CYTHS](https://github.com/cyosp/CYTHS) works on [Raspberry Pi](https://www.raspberrypi.org/products/)

It has been tested on models:

 * [Pi 2 Model B](https://www.raspberrypi.org/products/raspberry-pi-2-model-b/)

   Which was used during development phase
 
 * [Pi 3 Model B](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/)
 
   On this board Bluetooth has been added and connected to default UART
 
   To have it working you need:
   
   * Disable Bluetooth to restore default UART

        ```bash
        echo -e "\n# Disable Bluetooth to restore default UART\ndtoverlay=pi3-disable-bt\n" | sudo tee --append /boot/config.txt > /dev/null
        ```
   * Stop Bluetooth service

        ```bash
        sudo systemctl disable hciuart
        ```

    * Make sure you have `console=ttyAMA0` in `/boot/cmdline.txt`

   * And reboot system: `sudo reboot`

## License

**[CYTHS](https://github.com/cyosp/CYTHS)** is released under the BSD 3-Clause License.

See the bundled `LICENSE.md` for details.
