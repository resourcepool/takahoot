#include "GameController.h"
#include "board.h"
#include "configuration.h"
#include "BoardStateHandler.h"
#include "LedController.h"
#include "Calibrator.h"

GameController::GameController(Board* board, LedController* ledController) {
  this->board = board;
  this->boardStateHandler = new BoardStateHandler(board);
  this->ledController = ledController;
  calibrator = new Calibrator(&(board->trigger));
  this->reset();
}

void GameController::init() {
  this->boardStateHandler->init();
  this->ledController->setColor(CRGB::DeepPink);
  this->disable();
}


void GameController::reset() {
  connected = false;
  enabled = false;
  hit = false;
  color = CRGB();
  this->calibrator->reset();
}

void GameController::tick() {
  this->ledController->tick();
  // Now, we need to ensure target is calibrated
  if (!connected) {
    return;
  }
  if (shouldCalibrate()) {
    disableAndBlink(); 
    calibrate();
  }
  if (!calibrator->isDone()) {
    calibrator->tick();  
  }
  if (calibrator->hasCalibrationStateChanged()) {
    // If we have just finished calibrating
    enable();
  }
  if (hit || !connected || !enabled) {
    return;
  }
  this->boardStateHandler->refreshState();
  if (this->boardStateHandler->hasChanged() && this->boardStateHandler->isHit()) {
    this->confirmHit();
  }
}

bool GameController::isConnected() {
  return connected;
}

void GameController::setConnected(bool connected) {
  this->connected = connected;
  this->ledController->setConnected(connected);
  if (!connected) {
    disable();
    #ifdef DEBUG_MODE
      Serial.println("Device disconnected from controller");
    #endif
  } else {
    #ifdef DEBUG_MODE
      Serial.println("Device connected to controller");
    #endif
  }
}

void GameController::disableAndBlink() {
  if (!connected) {
    return;
  }
  ledController->blinkColor(CRGB::Orange);
  disable();
}

bool GameController::isEnabled() {
  return enabled;
}

void GameController::disable() {
  if (!connected) {
    return;
  }
  boardStateHandler->refreshState();
  enabled = false;
  #ifdef DEBUG_MODE
    Serial.println("Trigger disabled");
  #endif
}

void GameController::enable() {
  if (!connected) {
    return;
  }
  this->boardStateHandler->refreshState();
  enabled = true;
  hit = false;
  ledController->setColor(this->color);
  #ifdef DEBUG_MODE
    Serial.println("Trigger enabled");
  #endif
}


void GameController::setColor(CRGB rgb) {
  if (!connected) {
    return;
  }
  color = rgb;
  #ifdef DEBUG_MODE
    Serial.print("Color set to ");
    Serial.print(rgb[0]);
    Serial.print("-");
    Serial.print(rgb[1]);
    Serial.print("-");
    Serial.println(rgb[2]);
  #endif
}

void GameController::confirmHit() {
  if (!connected || !enabled) {
    return;
  }
  hit = true;
  enabled = false;
  ledController->blinkColor(CRGB::White);
  #ifdef DEBUG_MODE
    Serial.println("HIT Confirmed");
  #endif
}


bool GameController::shouldCalibrate() {
  return !calibrator->isDone() && !calibrator->isCalibrating();
}

bool GameController::isCalibrated() {
  return calibrator->isDone();
}

void GameController::changeTolerance(byte tolerance) {
  if (tolerance != this->board->tolerance) {
    #ifdef DEBUG_MODE
      Serial.print("Tolerance has changed to:");
      Serial.println(tolerance);
    #endif
    this->board->tolerance = tolerance;
    // FIXME serialService->sendToleranceChangedMessage();
  }
}

void GameController::calibrate() {
  calibrator->start();
}

byte* GameController::getState() {
  return new byte[2]{ connected + (calibrator->isCalibrating() << 1) + (enabled << 2) + (hit << 3), board->tolerance };
}
