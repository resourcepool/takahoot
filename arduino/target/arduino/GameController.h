#include <Arduino.h>
#include <FastLED.h>

struct Board;
struct Trigger;
class BoardStateHandler;
class LedController;
class Calibrator;

class GameController {
public:
  GameController(Board* board, LedController* ledController);
  // This is called once at startup
  void init();
  // This is called in constructor and on trigger reset
  void reset();
  // This is called at every loop
  void tick();
  // This will disable the trigger and set the lights orange
  void disableAndBlink();
  // This will disable the trigger
  void disable();
  // This will enable the trigger
  void enable();
  bool isConnected();
  void setConnected(bool connected);
  void setColor(CRGB rgb);
  bool isEnabled();
  // State is computed like this:
  // byte[] {0b 0000 HEKC, 0xtolerance}
  byte* getState();

  bool shouldCalibrate();
  bool isCalibrated();
  void calibrate();
  void changeTolerance(byte tolerance);
private:
  bool connected; // is connected when serial connection is established
  bool enabled; // is enabled when hits are recorded
  bool hit; // is hit
  CRGB color;
  Calibrator* calibrator;
  Board* board;
  BoardStateHandler* boardStateHandler;
  LedController* ledController;

  void confirmHit();
};
