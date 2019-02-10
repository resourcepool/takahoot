#include <Arduino.h>

#define SENSOR_MIN_VALUE 100

struct Board;
struct Trigger;

class BoardStateHandler {
public:
  void init();
  BoardStateHandler(Board* board);
  void refreshState();
  bool hasChanged();
private:
  Board* board;
  Board* previousBoard;
  void refreshState(Trigger* trigger);
};
