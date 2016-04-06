//
// Temperature and humidity sensor using RSL protocol
//
// @hardware ATTiny85
// @author CYOSP
// @version 1.0.0

// V 1.0.0 22/02/2016
//  Initial release

//
// Includes 
//

// Needed to reduce power consumption
#include <avr/sleep.h>
// Needed for DHT sensor
#include <dht.h>
// Needed for RSL send
#include <RCSwitch.h>
// Needed to store sensor id
#include <EEPROM.h>

//
// Defines
//

// Microcontroller pin mapping

// Power provided to DHT and 433 MHz transmitter is provided by microcontroller and not Vcc directly
#define POWER_PIN                         0
// Transmitter data pin
#define EMITTER_433_PIN                   1
// DHT sensor pin
#define DHT_PIN                           2
// Unconnected pin used to define sensor id if needed to be changed
#define UNCONNECTED_PIN_FOR_RANDOM_INIT   5

// Low power consumption values
#define WATCHDOG      9   // 9 => 8.3 seconds @ 8MHz
#define WATCHDOB_NBR  72  // 72 <=> 10 minutes (597 seconds) @ 8 MHz

// Low and maximum battery level
#define MAX_POWER 3550 // In mV
#define LOW_POWER 3450 // In mV

// Initialization part

// Watchdog interrupt number
volatile int index = WATCHDOB_NBR;

// RCSwitch library
RCSwitch mySwitch = RCSwitch();

// DHT library
dht DHT;

// Battery level
unsigned long batteryLevel = 0;

// Used to define if sensor identifier must be reseted
int resetSensorId = 0;
// Variable used to define lenght to read in EEPROM for reset sensor id
int bitLength_16 = 0;
// Position in EEPROM for sensor id reset number
int resetSensorIdInEEPROM = 0;

// Sensor identifier
unsigned long sensorId = 0;
// Variable used to define lenght to read in EEPROM for sensor id
// 32 bits are used for shift operations
unsigned long bitLength_32 = 0;
// Position in EEPROM for sensor id
unsigned long sensorIdInEEPROM = 0 + sizeof( resetSensorIdInEEPROM );

void setup()
{
  // Init random generator
  randomSeed( analogRead( UNCONNECTED_PIN_FOR_RANDOM_INIT ) );

  // Define pin states
  pinMode( POWER_PIN , OUTPUT );
  pinMode( DHT_PIN   , INPUT  );

  // Set power pin to low level
  digitalWrite( POWER_PIN , LOW );

  // Manage low energy
  setup_watchdog( WATCHDOG );

  //
  // Configure RCSwitch library
  //
  mySwitch.enableTransmit( EMITTER_433_PIN );
  // Set protocol
  // 2 <=> rc-rsl protocol
  mySwitch.setProtocol( 2 ); 
  // Set number of transmission repetitions
  mySwitch.setRepeatTransmit( 5 );

  //
  // Manage sensor id reset part
  //

  // Read reset sensor id value in EEPROM
  resetSensorId = EEPROM.get( resetSensorIdInEEPROM , bitLength_16 );
  // Increment reset number
  resetSensorId++;
  // Avoid false restart because being pluging battery
  delay( 3000 );
  // Put value in EEPROM
  EEPROM.put( resetSensorIdInEEPROM , resetSensorId );
  // Let choice to user to unconnect battery
  delay( 3000 );
  // Force use of a new sensor id
  if( resetSensorId >= 3 )
  {
    // Set sensor id in the same value as the first time the sensor is plugged to the battery
    sensorId = 0;
    // Store it in the EEPROM
    EEPROM.put( sensorIdInEEPROM , sensorId );
  }
  // Reset number of reset tried
  resetSensorId = 0;
  // Store it in the EEPROM
  EEPROM.put( resetSensorIdInEEPROM , resetSensorId );

  //
  // Generate a new sensor id if needed
  //  => First power on
  //  => Asked by user with 3 reboots
  //     Each one more than 3 seconds and less than 6 seconds
  //

  // Get sensor id in EEPROM
  sensorId = EEPROM.get( sensorIdInEEPROM , bitLength_32 );
  // A new sensor id must be generated
  if( sensorId == 0 )
  {
    // Define max value in random values
    int maxRandom = 1024;
    // Get a random value
    sensorId = random( maxRandom ); 
    // Random value is converted between 1 and 127 (7bits)
    sensorId = map( sensorId , 0 , maxRandom , 1 , 127 );
    // Store sensor id in EEPROM
    EEPROM.put( sensorIdInEEPROM , sensorId );
  }
}

void loop()
{
  // It's time to get sensor values
  if( index >= WATCHDOB_NBR )
  {
    // Reset watchdog index
    index = 0;

    // Power on DHT + 433 Mhz transmitter
    digitalWrite( POWER_PIN , HIGH );

    // Wait a while in order to have DHT stable
    // Wait 1 second
    delay( 1000 );

    // Read DHT sensor
    unsigned long chk = DHT.read22( DHT_PIN );
    // Get humidity
    unsigned long hum = (unsigned long) DHT.humidity;
    // Get temperature * 10
    unsigned long temp = (unsigned long) (DHT.temperature * 10.0 );
    // Adjust temperature in order to have it in the range 0 -> 1024
    temp = map( temp , -400 , 624 , 0 , 1024 );

    // "Manage" sensor library feedback codes
    switch( chk )
    {
      case DHTLIB_OK:
          break;
      case DHTLIB_ERROR_CHECKSUM:
          hum = temp = 100;
          break;
      case DHTLIB_ERROR_TIMEOUT:
          hum = temp = 200;
          break;
      case DHTLIB_ERROR_CONNECT:
          hum = temp = 300;
          break;
      case DHTLIB_ERROR_ACK_L:
         hum = temp = 400;
          break;
      case DHTLIB_ERROR_ACK_H:
          hum = temp = 500;
          break;
      default:
         hum = temp = 600;
          break;
    }

    // RSL code details
    // [2 bits/battery level] + [2 bits/protocol version] + [4 bits/1111 <=> rsl code not used] + [7 bits/sensor id] + [7 bits/humidity] + [10 bits/temperature]

    // Get Vcc value and map it to 4 values
    batteryLevel = map( readVcc() , LOW_POWER , MAX_POWER , 0 , 3 );

    // Define protocol (00) and code (1111)
    unsigned long protocolAndCode = 15;

    // Compute RSL code
    unsigned long code = batteryLevel << 30 | protocolAndCode << 24 | sensorId << 17 | hum << 10 | temp;

    // Send RSL code
    mySwitch.send( code , 32 );

    // Power off DHT + 433 Mhz transmitter
    digitalWrite( POWER_PIN , LOW );

    // Set microcontroller in sleep mode
    system_sleep();
  }
}

// Set system into the sleep state 
// System wakes up when watchdog is timed out
void system_sleep()
{
  // Set sleep mode
  set_sleep_mode( SLEEP_MODE_PWR_DOWN );
  // Enable sleep mode
  sleep_enable();
  // System sleeps here
  sleep_mode();
  // System continues execution here when watchdog timed out                     
  sleep_disable();   
}

// Configure watchdog time out
// 0 => 16ms
// 1 => 32ms
// 2 => 64ms
// 3 => 128ms
// 4 => 250ms
// 5 => 500ms
// 6 => 1sec
// 7 => 2secs
// 8 => 4secs
// 9 => 8secs
void setup_watchdog( int ii )
{
  byte bb;
  int ww;
  
  if( ii > 9 ) ii = 9;
  bb = ii & 7;
  
  if( ii > 7 ) bb |= (1<<5);
  bb |= (1<<WDCE);
  
  ww = bb;

  MCUSR &= ~(1<<WDRF);
  // Start timed sequence
  WDTCR |= (1<<WDCE) | (1<<WDE);
  // Set new watchdog timeout value
  WDTCR = bb;
  WDTCR |= _BV(WDIE);
}

// Watchdog Interrupt Service
// Is executed when watchdog timed out
ISR( WDT_vect )
{
  // Increment watchdog index
  index++;
}

// Measure input microcontroller voltage against internal 1.1V
// Return Vcc value in mV
long readVcc()
{
  // Read 1.1V reference against Vcc
  // Set the reference to Vcc and the measurement to the internal 1.1V reference
  #if defined(__AVR_ATmega32U4__) || defined(__AVR_ATmega1280__) || defined(__AVR_ATmega2560__)
    ADMUX = _BV(REFS0) | _BV(MUX4) | _BV(MUX3) | _BV(MUX2) | _BV(MUX1);
  #elif defined (__AVR_ATtiny24__) || defined(__AVR_ATtiny44__) || defined(__AVR_ATtiny84__)
    ADMUX = _BV(MUX5) | _BV(MUX0);
  #elif defined (__AVR_ATtiny25__) || defined(__AVR_ATtiny45__) || defined(__AVR_ATtiny85__)
    ADMUX = _BV(MUX3) | _BV(MUX2);
  #else
    ADMUX = _BV(REFS0) | _BV(MUX3) | _BV(MUX2) | _BV(MUX1);
  #endif  

  // Wait for Vref to settle
  delay( 2 );
  // Start conversion
  ADCSRA |= _BV(ADSC); 
  // Measuring
  while( bit_is_set( ADCSRA , ADSC ) ); 

  // Must read ADCL first
  // It then locks ADCH
  uint8_t low  = ADCL;
  // Unlock both 
  uint8_t high = ADCH; 
 
  long result = (high<<8) | low;

  // Calculate Vcc in mV
  // 1125300 = 1.1*1023*1000
  result = 1125300L / result; 

  // Return Vcc in mV
  return result; 
}
