#include "SerialService.h"

SerialService::SerialService(Board* board) {
  this->board = board;
}

void SerialService::start() {
  Serial.begin(BAUD_RATE);
}

void SerialService::sendStateChangedMessage() {

}

void SerialService::sendToleranceChangedMessage() {

}
