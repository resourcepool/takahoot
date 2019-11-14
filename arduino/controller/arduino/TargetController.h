#include <Arduino.h>
#include <FastLED.h>
#include <SPI.h>

struct Board;
struct Trigger;
class BoardStateHandler;
class SPIClient;
class SerialClient;

class TargetController {
public:
  TargetController(Board* board, SPIClient* spiClient, SerialClient* serialClient);
  // This is called once at startup
  void init();
  // This is called at every loop
  void tick();
  /**
   Initialize targets.
   This is called by the SerialClient on demand, or when connection state changes.
  */
  void initTargets();
  /**
   Connect or disconnect Controller from Computer.
  */
  void setConnected(bool connected);
  bool isConnected();
  /**
   Change target Tolerance
  */
  void changeTolerance(byte targetId, byte tolerance);
  /**
   Start calibration for a specific target
  */
  void startCalibration(byte targetId);
  /**
   Enable a specific target
  */
  void enableTarget(byte targetId);
  /**
   Disable a specific target
  */
  void disableTarget(byte targetId);
  /**
   Disable and blink a specific target
  */
  void disableAndBlinkTarget(byte targetId);
  /**
   Disable and blink all targets
  */
  void disableAndBlinkTargets();
  /**
    Retrieve the target state
    Controller state is defined like the following:
    targetId | state (0b 0000 HEKC) | tolerance
    for each target.
    Therefore, it consists of 12 bytes.
  */
  byte* getState();
  /**
   Reset targets.
   This is called by the SerialClient on demand
  */
  void resetTargets();
  
private:
  Board* board;
  SPIClient* spiClient;
  SerialClient* serialClient;
  BoardStateHandler* boardStateHandler;
  void refreshStates();
  void refreshState(byte targetId);
  void confirmHit();
  void sendCalibrationFinished();
  bool connected;
  long lastMillis;
};
