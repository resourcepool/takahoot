#include <Arduino.h>

struct Board;
struct Trigger;
class BoardStateHandler;
class LedController;
class SerialOutboundService;

class GameController {
public:
  GameController(Board* board);
  void init();
  void reset();
  void pause();
  void resume();
  void tick();
  bool isConnected();
  void setConnected(bool connected);
  bool isPaired();
  void setPaired(bool paired);
private:
  bool connected;
  bool paired;
  bool ready;
  bool hit;
  Board* board;
  BoardStateHandler* boardStateHandler;
  LedController* ledController;
  SerialOutboundService* serialService;
  void confirmHit();
};
