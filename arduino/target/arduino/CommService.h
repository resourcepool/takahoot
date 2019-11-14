#include <Arduino.h>

class GameController;
class LedController;
struct Msg;

// All outbound message commands start with 0011 <=> 48
#define IN_CONTROLLER_CONNECTED 0x30 // <=> 0011 0000
#define IN_CONTROLLER_START_CALIBRATION 0x31 // <=> 0011 0001
#define IN_CONTROLLER_CHANGE_TOLERANCE 0x32 // <=> 0011 0010

#define IN_CONTROLLER_ENABLE_TRIGGER 0x34 // <=> 0011 0100
#define IN_CONTROLLER_DISABLE_TRIGGER 0x35 // <=> 0011 0101
#define IN_CONTROLLER_DISABLE_TRIGGER_AND_BLINK 0x36 // <=> 0011 0102

#define IN_CONTROLLER_GET_STATE 0x38 // <=> 0011 1000

#define IN_CONTROLLER_RESET 0x3F // <=> 0011 1111

class CommService {
public:
  CommService(GameController* gameController, LedController* ledController);
  void tick();
  Msg onRequest(byte cmd);
private:
  GameController* gameController;
  LedController* ledController;
  byte buffer[4] = {0, 0, 0, 0};
  bool parsing;
  bool slaveSelected;
  byte remainingBytes;
  
  // For SPI
  byte total;
  byte currentIndex;
  byte* sendBuffer;
  Msg processCommand();
  Msg computeMsg(byte size, byte* data);
  Msg processControllerConnected();
  Msg processControllerReset();
  Msg processControllerGetState();
  Msg processControllerStartCalibration();
  void handleCommand();
  void setSS();
  void resetSS();
  const byte END_MESSAGE[2] = { 0x0D, 0x0A };
  const byte END_MESSAGE_SIZE = 2;
};
