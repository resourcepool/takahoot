#include <Arduino.h>

class GameController;
class CalibrationController;
class LedController;

// All outbound message commands start with 0011 <=> 48
#define IN_COMPUTER_CONNECTED 0x30 // <=> 0011 0000
#define IN_COMPUTER_START_PAIRING 0x31 // <=> 0011 0001
#define IN_COMPUTER_FINISH_PAIRING 0x32 // <=> 0011 0002
#define IN_COMPUTER_START_CALIBRATION 0x33 // <=> 0011 0003
#define IN_GAME_RESET 0x34 // <=> 0011 0004

class SerialInboundService {
public:
  SerialInboundService(GameController* gameController, CalibrationController* calibrationController, LedController* ledController);
  void tick();
private:
  GameController* gameController;
  CalibrationController* calibrationController;
  LedController* ledController;

};
