#include <Arduino.h>
class TargetController;

// All outbound message commands start with 0011 <=> 48
#define IN_COMPUTER_CONNECTED 0x30 // <=> 0011 0000
#define IN_COMPUTER_START_CALIBRATION 0x31 // <=> 0011 0001 0xTARGETID
#define IN_COMPUTER_CHANGE_TOLERANCE 0x32 // <=> 0011 0010 0xTARGETID 0xTOLERANCE

#define IN_COMPUTER_ENABLE_TARGET 0x34 // <=> 0011 0100 0xTARGETID
#define IN_COMPUTER_DISABLE_TARGET 0x35 // <=> 0011 0101 0xTARGETID
#define IN_COMPUTER_DISABLE_TARGET_AND_BLINK 0x36 // <=> 0011 0110 0xTARGETID
#define IN_COMPUTER_DISABLE_TARGETS_AND_BLINK 0x37 // <=> 0011 0110

#define IN_COMPUTER_GET_STATE 0x38 // <=> 0011 1000

#define IN_COMPUTER_RESET 0x3F // <=> 0011 1000

#define OUT_COMPUTER_CONNECTED 0x80 // <=> 0011 0000
#define OUT_COMPUTER_CALIBRATION_STARTED 0x81 // <=> 1100 0001
#define OUT_COMPUTER_CALIBRATION_FINISHED 0x82 // <=> 1100 0010
#define OUT_COMPUTER_TARGET_HIT 0x84 // <=> 1100 0100
#define OUT_COMPUTER_CONTROLLER_STATE 0x88 // <=> 1100 1000

class SerialClient {
public:
  SerialClient();
  void tick();
  void init(TargetController* ctrl);
  void sendConnected(byte* state);
  void sendTargetHit(byte* state);
  void sendState(byte* state);
  void sendCalibrationStarted();
  void sendCalibrationFinished(byte* state);
  void onRequest(byte cmd);
private:
  TargetController* ctrl;
  byte buffer[4] = {0, 0, 0, 0};
  bool parsing;
  byte total;
  byte currentIndex;
  void processCommand();
  const byte END_MESSAGE[2] = { 0x0D, 0x0A };
  const byte END_MESSAGE_SIZE = 2;
};
