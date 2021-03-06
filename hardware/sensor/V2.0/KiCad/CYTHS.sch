EESchema Schematic File Version 2
LIBS:power
LIBS:device
LIBS:transistors
LIBS:conn
LIBS:linear
LIBS:regul
LIBS:74xx
LIBS:cmos4000
LIBS:adc-dac
LIBS:memory
LIBS:xilinx
LIBS:microcontrollers
LIBS:dsp
LIBS:microchip
LIBS:analog_switches
LIBS:motorola
LIBS:texas
LIBS:intel
LIBS:audio
LIBS:interface
LIBS:digital-audio
LIBS:philips
LIBS:display
LIBS:cypress
LIBS:siliconi
LIBS:opto
LIBS:atmel
LIBS:contrib
LIBS:valves
LIBS:sensors
LIBS:cyosp
LIBS:CYTHS-cache
EELAYER 25 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L ATTINY85-S IC1
U 1 1 57A25814
P 7050 3850
F 0 "IC1" H 5900 4250 50  0000 C CNN
F 1 "ATTINY85-S" H 8050 3450 50  0000 C CNN
F 2 "SMD_Packages:SOIC-8-N" H 8000 3850 50  0000 C CIN
F 3 "" H 7050 3850 50  0000 C CNN
	1    7050 3850
	1    0    0    -1  
$EndComp
$Comp
L DHT22_Temperature_Humidity TH1
U 1 1 57A25AE9
P 2550 3450
F 0 "TH1" H 2550 4500 60  0000 C CNN
F 1 "DHT22" H 2550 4400 60  0000 C CNN
F 2 "Sensors:DHT22_Temperature_Humidity" H 2550 3450 60  0001 C CNN
F 3 "" H 2550 3450 60  0000 C CNN
	1    2550 3450
	1    0    0    -1  
$EndComp
$Comp
L RF_Transmitter_433_MHz RF1
U 1 1 57A25B62
P 4300 3450
F 0 "RF1" H 4300 4250 60  0000 C CNN
F 1 "Transmitter_433_MHz" H 4300 4150 60  0000 C CNN
F 2 "Sensors:RF_Transmitter_433_MHz" H 4300 3450 60  0001 C CNN
F 3 "" H 4300 3450 60  0000 C CNN
	1    4300 3450
	1    0    0    -1  
$EndComp
$Comp
L GND #PWR01
U 1 1 57BBEDAD
P 9250 4100
F 0 "#PWR01" H 9250 3850 50  0001 C CNN
F 1 "GND" H 9250 3950 50  0000 C CNN
F 2 "" H 9250 4100 50  0000 C CNN
F 3 "" H 9250 4100 50  0000 C CNN
	1    9250 4100
	1    0    0    -1  
$EndComp
$Comp
L VCC #PWR02
U 1 1 57BBEDC9
P 8700 2850
F 0 "#PWR02" H 8700 2700 50  0001 C CNN
F 1 "VCC" H 8700 3000 50  0000 C CNN
F 2 "" H 8700 2850 50  0000 C CNN
F 3 "" H 8700 2850 50  0000 C CNN
	1    8700 2850
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X06 P3
U 1 1 57C18B49
P 4650 4850
F 0 "P3" H 4650 5200 50  0000 C CNN
F 1 "PROG_HEADER" V 4750 4850 50  0000 C CNN
F 2 "Pin_Headers:Pin_Header_Angled_1x06" H 4650 4850 50  0001 C CNN
F 3 "" H 4650 4850 50  0000 C CNN
	1    4650 4850
	0    1    1    0   
$EndComp
$Comp
L CONN_01X01 P1
U 1 1 57C195FD
P 8700 3800
F 0 "P1" H 8700 3900 50  0000 C CNN
F 1 "VCC_HEADER" V 8800 3800 50  0000 C CNN
F 2 "Pin_Headers:Pin_Header_Straight_1x01" H 8700 3800 50  0001 C CNN
F 3 "" H 8700 3800 50  0000 C CNN
	1    8700 3800
	0    1    1    0   
$EndComp
$Comp
L CONN_01X01 P2
U 1 1 57C19671
P 8700 4300
F 0 "P2" H 8700 4400 50  0000 C CNN
F 1 "GND_HEADER" V 8800 4300 50  0000 C CNN
F 2 "Pin_Headers:Pin_Header_Straight_1x01" H 8700 4300 50  0001 C CNN
F 3 "" H 8700 4300 50  0000 C CNN
	1    8700 4300
	0    1    1    0   
$EndComp
Wire Wire Line
	4300 3500 4300 3450
Wire Wire Line
	2400 3450 2400 3500
Connection ~ 4300 3500
Wire Wire Line
	2700 3450 3500 3450
Wire Wire Line
	3500 3450 3500 2450
Connection ~ 4900 2450
Wire Wire Line
	8700 2850 8700 3600
Wire Wire Line
	8700 3600 8400 3600
Wire Wire Line
	3500 2450 9250 2450
Wire Wire Line
	9250 4100 9250 2450
Wire Wire Line
	4200 3450 4200 3900
Wire Wire Line
	4200 3900 5700 3900
Wire Wire Line
	2500 3450 2500 4000
Wire Wire Line
	2500 4000 5700 4000
Wire Wire Line
	4900 2450 4900 3450
Wire Wire Line
	4900 3450 4400 3450
Wire Wire Line
	5050 3500 5050 3000
Wire Wire Line
	2400 3500 5050 3500
Wire Wire Line
	4900 3400 4900 4650
Connection ~ 4900 3400
Wire Wire Line
	4400 4650 4400 3500
Connection ~ 4400 3500
Wire Wire Line
	5700 3600 4500 3600
Wire Wire Line
	4500 3600 4500 4650
Wire Wire Line
	5700 3700 4600 3700
Wire Wire Line
	4600 3700 4600 4650
Wire Wire Line
	5700 3800 4700 3800
Wire Wire Line
	4700 3800 4700 4650
Wire Wire Line
	5700 4100 4800 4100
Wire Wire Line
	4800 4100 4800 4650
Wire Wire Line
	5050 3000 8700 3000
Connection ~ 8700 3000
Wire Wire Line
	8400 4100 9250 4100
Connection ~ 8700 4100
$EndSCHEMATC
