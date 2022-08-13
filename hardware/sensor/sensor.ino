// Temperature and humidity sensor using RSL protocol

// Uncomment to choose sensor id
// Value range: 1 - 127
// #define STATIC_SENSOR_ID 51

// To reduce power consumption
#include <avr/sleep.h>
// For DHT sensor
#include <dht.h>
// For wireless transmission
#include <RCSwitch.h>
// To save data even when power is off
#include <EEPROM.h>


// Clear Bit of an I/O register
// Set to 0
#ifndef cbi
#define cbi(sfr, bit) (_SFR_BYTE(sfr) &= ~_BV(bit))
#endif
// Set Bit of an I/O register
// Set to 1
#ifndef sbi
#define sbi(sfr, bit) (_SFR_BYTE(sfr) |= _BV(bit))
#endif

// Define low frequency factor
// It has an impact on delay function
// /!\ Modify this value must be set according CLKPR in setLowFreq function
#define LOW_FREQ_FACTOR 256

// ATtiny85 pin mapping

// Unused pin
#define PIN_0                 0
// Unused pin
#define PIN_1                 1
// Unused pin
#define PIN_2                 2
// Transmitter pin
#define TRANSMITTER_433_PIN   3
// DHT pin
#define DHT_PIN               4
// Unused pin
#define PIN_5                 5

// Low power consumption values
#define WATCHDOG      9                 // 9 => 8,3 seconds
#define WATCHDOB_NBR  36                // 36 <=> 5 minutes (299 seconds)
#define WATCHDOB_COUNT_TO_READ_POWER 36 // 36 * 5 minutes <=> 6 hours

// Watchdog interrupt number
volatile int index = WATCHDOB_NBR;
unsigned int watchdogCount = WATCHDOB_COUNT_TO_READ_POWER;

RCSwitch mySwitch = RCSwitch();
dht DHT;

unsigned long batteryLevel = 4;

// Define protocol (00) and code (1111)
unsigned long protocolAndCode = 15;

// Used to define if sensor identifier must be reseted
int resetSensorId = 0;
// Used to define lenght to read in EEPROM for reset sensor id
int bitLength_16 = 0;
// Position in EEPROM for sensor id reset number
int resetSensorIdInEEPROM = 0;

// Sensor identifier
unsigned long sensorId = 0;
// Used to define lenght to read in EEPROM for sensor id
// 32 bits are used for shift operations
unsigned long bitLength_32 = 0;
// Position in EEPROM for sensor id
unsigned long sensorIdInEEPROM = 0 + sizeof( resetSensorIdInEEPROM );

void setup() {
  // Set microcontroller to low frequency
  // TO ENABLE AT THE END BECAUSE AFTER IT'S MORE DIFFICULT TO PROGRAM AGAIN ATtiny85
  //setLowFreq();

  // Disable ADC
  ADCSRA = 0;
  
  // Define pin states
  pinMode( PIN_0  , OUTPUT );
  pinMode( PIN_1  , OUTPUT );
  pinMode( PIN_2  , OUTPUT );
  pinMode( DHT_PIN, INPUT  );
  pinMode( PIN_5  , OUTPUT );

  // Set to low level unused pins
  digitalWrite( PIN_0, LOW  );
  digitalWrite( PIN_1, LOW  );
  digitalWrite( PIN_2, LOW  );
  digitalWrite( PIN_5, LOW  );

  mySwitch.enableTransmit( TRANSMITTER_433_PIN );
  // Protocol: 2 <=> rc-rsl 
  mySwitch.setProtocol( 2 ); 
  mySwitch.setRepeatTransmit( 5 );

  //
  // Manage sensor id reset part
  //
  #ifndef STATIC_SENSOR_ID
    resetSensorId = EEPROM.get( resetSensorIdInEEPROM , bitLength_16 );
    resetSensorId++;
    // Avoid false restart because being pluging battery
    delay( 3000 /*/ LOW_FREQ_FACTOR*/ );
    EEPROM.put( resetSensorIdInEEPROM , resetSensorId );
    // Let choice to user to unconnect battery
    delay( 3000 /*/ LOW_FREQ_FACTOR*/ );
    if( resetSensorId >= 3 ) {
      sensorId = 0;
      EEPROM.put( sensorIdInEEPROM , sensorId );
    }

    resetSensorId = 0;
    EEPROM.put( resetSensorIdInEEPROM , resetSensorId );

    //
    // Generate a new sensor id if needed
    //  => First power on
    //  => Asked by user with 3 reboots
    //     Each one more than 3 seconds and less than 6 seconds
    //
    sensorId = EEPROM.get( sensorIdInEEPROM , bitLength_32 );
    if( sensorId == 0 ) {
      // Init random generator with a DHT read
      DHT.read22( DHT_PIN );
      randomSeed( DHT.temperature * DHT.humidity );
   
      sensorId = random( 1 , 127 );
      EEPROM.put( sensorIdInEEPROM , sensorId );
    }
  #else
    sensorId = STATIC_SENSOR_ID;
    // Wait same time as random sensor id phase
    // It allows also to have a correct DHT measure
    delay( 6000 /*/ LOW_FREQ_FACTOR*/ );
  #endif

  // Manage low energy
  setup_watchdog( WATCHDOG );
}

void loop() {
  // It's time to get sensor values
  if( index >= WATCHDOB_NBR )
  {
    index = 0;

    // Set microcontroller to high frequency
    setHighFreq();

    unsigned long vcc = readVcc();
    if(watchdogCount >= WATCHDOB_COUNT_TO_READ_POWER) {
        watchdogCount = 0;
    } else {
        watchdogCount++;
    }
      
    unsigned long chk = DHT.read22( DHT_PIN );
    
    // Set microcontroller to low frequency
    setLowFreq();

    // Battery voltage mapping per element
    // 1.5V : full capacity
    // 1.3V : 60% to 80% capacity
    // 1.2V : 30% to 60% capacity
    // 1.0V : empty
    unsigned long vccMapping = 0;
    if(vcc>=4500) {
      vccMapping = 3;
    } else if (vcc>=3900) {
      vccMapping = 2;
    } else if (vcc>=3600) {
      vccMapping = 1;
    }
    // Battery voltage can only down
    // It avoids battery level to up and down near threshold
    if(vccMapping<batteryLevel) {
      batteryLevel = vccMapping;
    }
    
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

    // Compute RSL code
    unsigned long code = batteryLevel << 30 | protocolAndCode << 24 | sensorId << 17 | hum << 10 | temp;

    setHighFreq();
    mySwitch.send( code , 32 );
    setLowFreq();
  }

   // Set microcontroller in sleep mode
   system_sleep();
}

// Set system into the sleep state 
// System wakes up when watchdog is timed out
void system_sleep() {
  // Set sleep mode
  set_sleep_mode( SLEEP_MODE_PWR_DOWN );
  // System sleeps here
  sleep_mode();
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
void setup_watchdog( int ii ) {
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
ISR( WDT_vect ) {
  index++;
}

// Measure input microcontroller voltage against internal 1.1V
// Return Vcc value in mV
long readVcc() {
  // switch Analog to Digitalconverter ON
  sbi( ADCSRA , ADEN );                           
  
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

  // switch Analog to Digitalconverter OFF
  cbi( ADCSRA , ADEN );    
  
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

// Set microcontroller to high frequency
void setHighFreq() {
  // Disable interrupts
  cli();
  // Enable prescaler
  CLKPR = (1<<CLKPCE) | (0<<CLKPS3) | (0<<CLKPS2) | (0<<CLKPS1) | (0<<CLKPS0);
  // Divide clock by 1
  CLKPR = (0<<CLKPS3) | (0<<CLKPS2) | (0<<CLKPS1) | (0<<CLKPS0);
  // Enable interrupts
  sei();
}

// Set microcontroller to low frequency
void setLowFreq() {
  // Disable interrupts
  cli();
  // Enable prescaler
  CLKPR = (1<<CLKPCE) | (0<<CLKPS3) | (0<<CLKPS2) | (0<<CLKPS1) | (0<<CLKPS0);
  // Divide clock by 256
  CLKPR = (1<<CLKPS3) | (0<<CLKPS2) | (0<<CLKPS1) | (0<<CLKPS0);
  // Enable interrupts
  sei();
}
