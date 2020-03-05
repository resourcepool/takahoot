#include <Arduino.h>
#include <FastLED.h>

#define OUT_BUMPER_CONNECT 0x30 // <=> 0011 0000
#define OUT_BUMPER_START_CALIBRATION 0x31 // <=> 0011 0001
#define OUT_BUMPER_CHANGE_TOLERANCE 0x32 // <=> 0011 0010

#define OUT_BUMPER_ENABLE 0x34 // <=> 0011 0100
#define OUT_BUMPER_DISABLE 0x35 // <=> 0011 0101
#define OUT_BUMPER_DISABLE_AND_BLINK 0x36 // <=> 0011 0110

#define OUT_BUMPER_GET_STATE 0x38 // <=> 0011 1000

#define OUT_BUMPER_RESET 0x3F // <=> 0011 1111

class SPIClient {
public:
  SPIClient();
  void init(byte* pins);

  byte* initBumper(byte pin, CRGB color);
  bool startCalibration(byte pin);
  bool changeTolerance(byte pin, byte tolerance);
  bool enable(byte pin);
  bool disable(byte pin);
  bool disableAndBlink(byte pin);
  bool reset(byte pin);
  byte* getState(byte pin);
private:
  byte buffer[4] = {0, 0, 0, 0};
  bool parsing;
  byte remainingBytes;
  byte transferSPI(byte c);
  bool getResponseBuffer();
  const byte END_MESSAGE[2] = { 0x0D, 0x0A };
  const byte END_MESSAGE_SIZE = 2;
};
