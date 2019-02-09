#include "GameController.h"
#include "board.h"
#include "configuration.h"
#include "BoardStateHandler.h"
#include "LedController.h"
#include "SerialOutboundService.h"

GameController::GameController(Board* board) {
  this->board = board;
  this->boardStateHandler = new BoardStateHandler(board);
  this->ledController = new LedController();
  this->serialService = new SerialOutboundService(board);
  this->ready = false;
  this->hit = false;
}

void GameController::init() {
  this->boardStateHandler->init();
  this->reset();
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

void GameController::setPaired(bool paired) {
  this->paired = paired;
  this->ledController->setPaired(paired);
  if (!paired) {
    reset();
  }
}

void GameController::pause() {
  if (!connected) {
    return;
  }
  this->ready = false;
  this->ledController->setReady(false);
  #ifdef DEBUG_MODE
    Serial.println("Game Paused");
  #endif
}

void GameController::reset() {
  if (!connected) {
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
  if (!connected) {
    return;
  }
  this->boardStateHandler->refreshState();
  this->ready = true;
  this->ledController->setReady(true);
  #ifdef DEBUG_MODE
    Serial.println("Game resumed");
  #endif
}

void GameController::confirmHit() {
  if (!connected) {
    return;
  }
  hit = true;
  ledController->setHit(true);
  serialService->sendTargetHitMessage();
  #ifdef DEBUG_MODE
    Serial.println("HIT!");
  #endif
}
