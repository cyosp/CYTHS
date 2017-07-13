//
// piTransceiver firmware
//
// @hardware ATtiny85
// @author CYOSP
// @version 1.0.0

// V 1.0.0 2016-05-22
//  Initial release

//
// Includes 
//

// Needed to receive codes over 433 Mhz
#include <RCSwitch.h>
// Serial librarie
#include <AsmTinySerial.h>  

//
// Microcontroller pin mapping
//

// LED pin
#define LED_PIN           PB0
// Pin connected to the 433 Mhz receiver 
#define RECEIVER_433_PIN  PB1
// Pin connected to the serial port of the Raspberry Pi
#define UART_Tx           PB3

// Define serial baud rate for communication with Raspberry Pi
#define UART_BAUDE_RATE   115200

// RCSwitch library
RCSwitch mySwitch = RCSwitch();
// Define a character array able to store code from unsigned long (32 bits) to string
char codeAsString[ 6 ];

//
// Code can be sent several times in order to be sure it will be received
// Here is the necessary to manage it and transmit only once to the Raspberry Pi
//
#define AVOID_REPEAT_CODE_BELOW_MSEC  500
unsigned long previousReceivedTime = 0;
unsigned long previousCode = 0;

void setup()
{
  // Initialize serial communication
  SerialInit( UART_Tx , UART_BAUDE_RATE );

  // Define LED pin state
  pinMode( LED_PIN , OUTPUT );

  // Start first LED flash 
  digitalWrite( LED_PIN , HIGH );
  delay( 1000 );
  digitalWrite( LED_PIN , LOW );

  // Send "Init" string over serial port
  SerialTx( "Init\n" );

  // Wait a moment
  delay( 500 );
  
  // Second LED flash
  digitalWrite( LED_PIN , HIGH );
  delay( 1000 );
  digitalWrite( LED_PIN , LOW );

  // Enable to receive codes
  mySwitch.enableReceive( RECEIVER_433_PIN );
}

void loop()
{
  // A code is available
  if( mySwitch.available() )
  {
    // Get current time
    unsigned long currentTime = millis();
    // Get code received
    unsigned long currentCode = mySwitch.getReceivedValue();

    // Check if it's a new code to manage
    if( currentCode != previousCode && ( (currentTime - previousReceivedTime) > AVOID_REPEAT_CODE_BELOW_MSEC) )
    {
      // Transform code which is a number into a string
      sprintf( codeAsString , "%lu\n", currentCode );

      // Send code over serial port
      SerialTx( codeAsString );

      // Flash LED
      digitalWrite( LED_PIN , HIGH );
      delay( 50 );
      digitalWrite( LED_PIN , LOW );
    }

    // Update backup values
    previousReceivedTime = currentTime;
    previousCode = currentCode;
    
    // It's now possible to receive a new code
    mySwitch.resetAvailable();
  }

}

