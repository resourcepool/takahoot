#include "BoardStateHandler.h"
#include "board.h"
#include "configuration.h"

BoardStateHandler::BoardStateHandler(Board* board) {
  this->board = board;
  this->previousBoard = (Board*) malloc(sizeof (struct Board));
  memcpy(this->previousBoard, this->board, sizeof(struct Board));
}

void BoardStateHandler::init() {
  pinMode(board->red.btn, INPUT);
  pinMode(board->blue.btn, INPUT);
  pinMode(board->yellow.btn, INPUT);
  pinMode(board->green.btn, INPUT);
}

void BoardStateHandler::refreshState() {
  memcpy(this->previousBoard, this->board, sizeof(struct Board));
  refreshState(&(board->red));
  refreshState(&(board->blue));
  refreshState(&(board->yellow));
  refreshState(&(board->green));
}

void BoardStateHandler::refreshState(Trigger* trigger) {
  int analogValue = analogRead(trigger->btn);
  bool newState = (analogValue > (trigger->threshold + this->board->tolerance));
  trigger->state = newState;
  trigger->value = analogValue;
}

bool BoardStateHandler::hasChanged() {
  bool r = (this->board->red.state != this->previousBoard->red.state)
  || (this->board->blue.state != this->previousBoard->blue.state)
  || (this->board->yellow.state != this->previousBoard->yellow.state)
  || (this->board->green.state != this->previousBoard->green.state);
  #ifdef DEBUG_MODE
    if (r) {
      Serial.print("Red:");
      Serial.print(this->board->red.value);
      Serial.print(" was ");
      Serial.println(this->previousBoard->red.value);
      Serial.print("Blue:");
      Serial.print(this->board->blue.value);
      Serial.print(" was ");
      Serial.println(this->previousBoard->blue.value);
      Serial.print("Green:");
      Serial.print(this->board->green.value);
      Serial.print(" was ");
      Serial.println(this->previousBoard->green.value);
      Serial.print("Yellow:");
      Serial.print(this->board->yellow.value);
      Serial.print(" was ");
      Serial.println(this->previousBoard->green.value);
    }
  #endif
  return r;
}
