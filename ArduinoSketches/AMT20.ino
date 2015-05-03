#include <SPI.h>

#include "ESP8266.h"
#include <SoftwareSerial.h>

SoftwareSerial mySerial(3, 2);

#define SSID        ""
#define PASSWORD    ""
#define HOST_NAME   "192.168.43.246"
#define HOST_PORT   (3000)

ESP8266 wifi(mySerial);

// No operation command
const byte NO_OP = 0x00;
// Read position command
const byte READ_POS = 0x10;

// Pin to reset the clock counter
const int csb_pin = 7;

void setup() {
  Serial.begin(9600);
  SPI.begin();
  Serial.print("setup begin\r\n");

//  Serial.print("FW Version:");
//  Serial.println(wifi.getVersion().c_str());

  if (wifi.setOprToStationSoftAP()) {
      Serial.print("to station + softap ok\r\n");
  } else {
      Serial.print("to station + softap err\r\n");
  }

  if (wifi.joinAP(SSID, PASSWORD)) {
      Serial.print("Join AP success\r\n");
      Serial.print("IP: ");
      Serial.println(wifi.getLocalIP().c_str());
  } else {
      Serial.print("Join AP failure\r\n");
  }

  if (wifi.disableMUX()) {
      Serial.print("single ok\r\n");
  } else {
      Serial.print("single err\r\n");
  }

  pinMode(csb_pin, OUTPUT);
  Serial.print("setup end\r\n");
  delay(1000);
}

void loop() {
  byte resp;
  int first;
  int second;
  uint8_t buffer[128] = {0};

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
  if (wifi.registerUDP(HOST_NAME, HOST_PORT)) {
      Serial.print("register udp ok\r\n");
  } else {
      Serial.print("register udp err\r\n");
  }

  char msg[5];
  itoa(first, msg, 10);
  Serial.print(msg);
  wifi.send((const uint8_t*)msg, strlen(msg));

  if (wifi.unregisterUDP()) {
      Serial.print("unregister udp ok\r\n");
  } else {
      Serial.print("unregister udp err\r\n");
  }
  delay(50);
}
