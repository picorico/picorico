#include <SPI.h>

// No operation command
const byte NO_OP = 0x00;
// Read position command
const byte READ_POS = 0x10;

// Pin to reset the clock counter
const int csb_pin = 7;

void setup() {
  Serial.begin(9600);
  SPI.begin();
  
  pinMode(csb_pin, OUTPUT);
  Serial.println("INIT");
  delay(1000);
}

void loop() {
  byte resp;
  int first;
  int second;
  
  digitalWrite(csb_pin, LOW);
  resp = SPI.transfer(READ_POS);
  delayMicroseconds(20);

  while(resp ==  0xA5) {
    resp = SPI.transfer(NO_OP);
    delayMicroseconds(20);
    Serial.println(resp, HEX);
  }
  
  if(resp == 0x10) {
    // Read the first 8 bits of the position
    digitalWrite(csb_pin, HIGH);
    digitalWrite(csb_pin, LOW);
    first = SPI.transfer(NO_OP);
    delayMicroseconds(20);
    first = first << 8;

    // Read the last 8 bits of the position
    digitalWrite(csb_pin, HIGH);
    digitalWrite(csb_pin, LOW);
    second = SPI.transfer(NO_OP);
    delayMicroseconds(20);
    
    // Position
    first = first | second;

    // Print the position
    Serial.println(first, DEC);
  }

  digitalWrite(csb_pin, HIGH);

  delay(50);
}
