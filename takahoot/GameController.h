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
private:
  bool connected;
  bool ready;
  bool hit;
  Board* board;
  BoardStateHandler* boardStateHandler;
  LedController* ledController;
  SerialOutboundService* serialService;
  void confirmHit();
};
