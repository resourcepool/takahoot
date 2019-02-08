#include <Arduino.h>
#include "board.h"

#ifndef BAUD_RATE
#define BAUD_RATE 115200
#endif

class SerialService {
public:
  SerialService(Board* board);
  void start();
  void sendStateChangedMessage();
  void sendToleranceChangedMessage();
private:
  // Board state message is a byte that starts with 11XXGYBR <=> 0xC0 <=> 192
  // R is red (1 is high <=> triggered, 0 is low <=> idle)
  // B is blue (1 is high <=> triggered, 0 is low <=> idle)
  // Y is yellow (1 is high <=> triggered, 0 is low <=> idle)
  // G is green (1 is high <=> triggered, 0 is low <=> idle)
  const byte BOARD_STATE_MSG = 192;
  // Board tolerance message is a byte that starts with 10XXXXXX <=> 0x80 <=> 128
  // XXXXX is the current tolerance. It goes from 0 to 20.
  const byte BOARD_TOLERANCE_MSG = 128;
  Board* board;

};
