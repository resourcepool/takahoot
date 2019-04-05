#include "GameController.h"
#include "board.h"
#include "configuration.h"
#include "BoardStateHandler.h"
#include "LedController.h"
#include "SerialOutboundService.h"

GameController::GameController(Board* board, LedController* ledController) {
  this->board = board;
  this->boardStateHandler = new BoardStateHandler(board);
  this->ledController = ledController;
  this->serialService = new SerialOutboundService(board);
  this->ready = false;
  this->hit = false;
}

void GameController::init() {
  this->boardStateHandler->init();
  this->reset();
  this->serialService->sendDeviceInitializedMessage();
}

void GameController::tick() {
  this->ledController->tick();
  if (hit || !connected) {
    return;
  }
  this->boardStateHandler->refreshState();
  if (this->boardStateHandler->hasChanged()) {
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
    reset();
  } else {
    serialService->sendDeviceConnectedMessage();
  }
}


bool GameController::isPaired() {
  return paired;
}

void GameController::setPairingStarted() {
  this->paired = false;
  this->ledController->setPairingStarted();
}

void GameController::setPairingFinished() {
  this->paired = true;
  this->ledController->setPairingFinished();
  reset();
}

void GameController::pause() {
  if (!connected || !paired) {
    return;
  }
  this->ready = false;
  this->ledController->setReady(false);
  #ifdef DEBUG_MODE
    Serial.println("Game Paused");
  #endif
}

void GameController::reset() {
  if (!connected || !paired) {
    return;
  }
  this->boardStateHandler->refreshState();
  this->hit = false;
  this->ledController->setHit(false);
  #ifdef DEBUG_MODE
    Serial.println("Game Reset");
  #endif
}

void GameController::resume() {
  if (!connected || !paired) {
    return;
  }
  this->boardStateHandler->refreshState();
  this->ready = true;
  this->ledController->setReady(true);
  if (hit) {
    this->ledController->setHit(true);
  }
  #ifdef DEBUG_MODE
    Serial.println("Game resumed");
  #endif
}

void GameController::confirmHit() {
  if (!connected || !paired) {
    return;
  }
  hit = true;
  ledController->setHit(true);
  serialService->sendTargetHitMessage();
  #ifdef DEBUG_MODE
    Serial.println("HIT Confirmed");
  #endif
}
