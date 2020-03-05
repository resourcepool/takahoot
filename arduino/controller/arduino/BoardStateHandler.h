#include <Arduino.h>

struct Board;
struct Bumper;

class BoardStateHandler {
public:
  void init();
  BoardStateHandler(Board* board);
  void refreshState(byte id, byte* state);
  bool hasHitChanged();
  bool isHit();
  bool hasCalibrationChanged();
  bool isCalibrated();
  void prettyPrint();
private:
  Board* board;
  Board* previousBoard;
};
