#include <Arduino.h>

#define LED_BLINK_TIME_MS 1000

struct Board;
struct Trigger;
class BoardStateHandler;

class LedController {
public:
  LedController();
  void setConnected(bool connected);
  void setPaired(bool paired);
  void setReady(bool ready);
  void setHit(bool hit);
  void tick();
private:
  bool isConnected;
  bool isBlinking;
  long lastBlink;
  bool lastBlinkValue;
  void tickBlink();
  void reset();
};
