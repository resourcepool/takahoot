#include "BoardStateHandler.h"
#include "board.h"
#include "configuration.h"

BoardStateHandler::BoardStateHandler(Board* board) {
  this->board = board;
  this->previousBoard = (Board*) malloc(sizeof(struct Board));
  memcpy(this->previousBoard, this->board, sizeof(struct Board));
}

void BoardStateHandler::init() {
  pinMode(board->trigger.btn, INPUT);
}

void BoardStateHandler::refreshState() {
  memcpy(this->previousBoard, this->board, sizeof(struct Board));
  int analogValue = analogRead(board->trigger.btn);
  bool newState = (analogValue > (board->trigger.threshold + board->tolerance)); // || (analogValue < (board->trigger.threshold - board->tolerance));
  board->trigger.state = newState;
  board->trigger.value = analogValue;
}



bool BoardStateHandler::isHit() {
  return board->trigger.state;
}

bool BoardStateHandler::hasChanged() {
  bool r = (board->trigger.state != previousBoard->trigger.state);
  #ifdef DEBUG_MODE
    if (r && board->trigger.state) {
      Serial.print("Trigger was HIT : tolerance:");
      Serial.print(this->board->tolerance);
      Serial.print(" value:");
      Serial.print(this->board->trigger.value);
      Serial.print(" threshold:");
      Serial.println(this->board->trigger.threshold);
    }
  #endif
  return r;
}
