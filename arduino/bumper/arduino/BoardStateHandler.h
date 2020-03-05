#include <Arduino.h>

struct Board;
struct Trigger;

class BoardStateHandler {
public:
  void init();
  BoardStateHandler(Board* board);
  void refreshState();
  bool hasChanged();
  bool isHit();
private:
  Board* board;
  Board* previousBoard;
};
