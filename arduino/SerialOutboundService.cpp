#include "SerialOutboundService.h"
#include "GameController.h"
#include "configuration.h"
#include "board.h"

SerialOutboundService::SerialOutboundService(Board* board) {
  this->board = board;
}

void SerialOutboundService::sendDeviceInitializedMessage() {
  Serial.write(OUT_DEVICE_INITIALIZED);
  Serial.write(END_MESSAGE, END_MESSAGE_SIZE);
}

void SerialOutboundService::sendDeviceConnectedMessage() {
  Serial.write(OUT_DEVICE_CONNECTED);
  Serial.write(END_MESSAGE, END_MESSAGE_SIZE);
}

void SerialOutboundService::sendDeviceCalibrationStartedMessage() {
  Serial.write(OUT_DEVICE_CALIBRATION_STARTED);
  Serial.write(END_MESSAGE, END_MESSAGE_SIZE);
}

void SerialOutboundService::sendDeviceCalibrationFinishedMessage() {
  Serial.write(OUT_DEVICE_CALIBRATION_FINISHED);
  Serial.write(END_MESSAGE, END_MESSAGE_SIZE);
}

void SerialOutboundService::sendTargetHitMessage() {
  byte msg = (this->board->red.state ? 0x01 : 0x00) +
  (this->board->blue.state ? 0x02 : 0x00) +
  (this->board->yellow.state ? 0x04 : 0x00) +
  (this->board->green.state ? 0x08 : 0x00);
  Serial.write(OUT_TARGET_HIT);
  Serial.write(msg);
  Serial.write(END_MESSAGE, END_MESSAGE_SIZE);
}

void SerialOutboundService::sendToleranceChangedMessage() {
  byte msg = (byte) (this->board->tolerance * 100 / MAX_TOLERANCE_FLOAT);
  Serial.write(OUT_TOLERANCE_CHANGED);
  Serial.write(msg);
  Serial.write(END_MESSAGE, END_MESSAGE_SIZE);
}
