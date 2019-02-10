#include "BoardStateHandler.h"
#include "board.h"
#include "configuration.h"

BoardStateHandler::BoardStateHandler(Board* board) {
  this->board = board;
  this->previousBoard = (Board*) malloc(sizeof(struct Board));
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
  if (analogValue < SENSOR_MIN_VALUE) {
    trigger->state = false;
    trigger->value = -1;
    return;
  }
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
      Serial.print("Tolerance is:");
      Serial.println(this->board->tolerance);
      Serial.print("Red:");
      Serial.print(this->board->red.value);
      Serial.print(" threshold ");
      Serial.println(this->board->red.threshold);
      if (this->board->red.state) {
        Serial.println("HIT!!!");
      }
      Serial.print("Blue:");
      Serial.print(this->board->blue.value);
      Serial.print(" threshold ");
      Serial.println(this->board->blue.threshold);
      if (this->board->blue.state) {
        Serial.println("HIT!!!");
      }
      Serial.print("Yellow:");
      Serial.print(this->board->yellow.value);
      Serial.print(" threshold ");
      Serial.println(this->board->yellow.threshold);
      if (this->board->yellow.state) {
        Serial.println("HIT!!!");
      }
      Serial.print("Green:");
      Serial.print(this->board->green.value);
      Serial.print(" threshold ");
      Serial.println(this->board->green.threshold);
      if (this->board->green.state) {
        Serial.println("HIT!!!");
      }
    }
  #endif
  return r;
}
