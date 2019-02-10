#include "CalibrationController.h"
#include "board.h"
#include "configuration.h"
#include "SerialOutboundService.h"

CalibrationController::CalibrationController(Board* board) {
  this->board = board;
  this->calibrated = false;
  this->serialService = new SerialOutboundService(board);
  pinMode(BTN_CALIBRATE, INPUT);
}

bool CalibrationController::shouldCalibrate() {
  return !digitalRead(BTN_CALIBRATE);
}

bool CalibrationController::isCalibrated() {
  return this->calibrated;
}

void CalibrationController::tick() {
  byte tolerance = (byte) (analogRead(POT_THRESHOLD) * TOLERANCE_RATIO);
  if (tolerance != this->board->tolerance) {
    #ifdef DEBUG_MODE
      Serial.print("Tolerance has changed to:");
      Serial.println(tolerance);
    #endif
    this->board->tolerance = tolerance;
    serialService->sendToleranceChangedMessage();
  }
}

void CalibrationController::calibrate() {
  serialService->sendDeviceCalibrationStartedMessage();
  #ifdef DEBUG_MODE
    Serial.println();
    Serial.print("Calibration will start in 3...");
  #endif
  for (int d = 2; d > 0; d--) {
    #ifdef DEBUG_MODE
      Serial.print(d);
      Serial.print("...");
    #endif
    delay(1000);
  }
  #ifdef DEBUG_MODE
    Serial.println();
    Serial.println("Calibration started");
  #endif
  calibrate(&(board->red));
  calibrate(&(board->blue));
  calibrate(&(board->yellow));
  calibrate(&(board->green));
  #ifdef DEBUG_MODE
    Serial.println("Calibration finished");
  #endif
  this->calibrated = true;
  serialService->sendDeviceCalibrationFinishedMessage();
}

void CalibrationController::calibrate(Trigger* trigger) {
  int threshold = 0;
  int maxThreshold = 0;
  int loops = 0;
  int lastVal = 0;
  for (loops = 0; loops < CALIBRATION_IT_COUNT; loops++) {
    lastVal = analogRead(trigger->btn);
    if (lastVal > maxThreshold) {
      maxThreshold = lastVal;
    }
    threshold += lastVal;
    delay(2);
  }
  trigger->threshold = maxThreshold;
  #ifdef DEBUG_MODE
    Serial.println("New threshold is ");
    Serial.println(trigger->threshold);
  #endif
}
