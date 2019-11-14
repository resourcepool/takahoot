#include "TargetController.h"
#include "SerialClient.h"
#include "SPIClient.h"
#include "board.h"
#include "configuration.h"
#include "BoardStateHandler.h"

TargetController::TargetController(Board* board, SPIClient* spiClient, SerialClient* serialClient) {
  this->board = board;
  this->boardStateHandler = new BoardStateHandler(board);
  this->spiClient = spiClient;
  this->serialClient = serialClient;
}

void TargetController::init() {
  serialClient->init(this);
  boardStateHandler->init();
  byte targetCount = (sizeof(board->targets) / sizeof(Target));
  byte pins[targetCount];
  for (byte i = 0; i < targetCount; i++) {
    pins[i] = board->targets[i].pin;
  }
  spiClient->init(pins);
}

void TargetController::tick() {
  serialClient->tick();
  if (!connected) {
    return;
  }
  this->refreshStates();
  #ifdef DEBUG_MODE
  if (millis() - lastMillis > 1000) {
    lastMillis = millis();
    boardStateHandler->prettyPrint(); 
  }
  #endif
  if (this->boardStateHandler->hasHitChanged() && this->boardStateHandler->isHit()) {
    confirmHit();
  }
  if (this->boardStateHandler->hasCalibrationChanged() && this->boardStateHandler->isCalibrated()) {
    sendCalibrationFinished();
  }
}


void TargetController::initTargets() {
  Target* t;
  byte targetCount = (sizeof(board->targets) / sizeof(Target));
  for (int i = 0; i < targetCount; i++) {
    t = &(board->targets[i]);
    byte* state = spiClient->initTarget(t->pin, t->color);
    boardStateHandler->refreshState(t->id, state);
    free(state);
  }
}

bool TargetController::isConnected() {
  return connected;
}

void TargetController::setConnected(bool connected) {
  this->connected = connected;
  if (!connected) {
    #ifdef DEBUG_MODE
    Serial.println("Device disconnected from controller");
    #endif
  } else {
    #ifdef DEBUG_MODE
    Serial.println("Device connected to controller");
    #endif
    initTargets();
    #ifdef DEBUG_MODE
    boardStateHandler->prettyPrint();
    #endif
    byte* state = getState();
    this->serialClient->sendConnected(state);
    free(state);
  }
}

void TargetController::changeTolerance(byte targetId, byte tolerance) {
  spiClient->changeTolerance(board->targets[targetId].pin, tolerance);
  refreshState(targetId);
}


void TargetController::startCalibration(byte targetId) {
  spiClient->startCalibration(board->targets[targetId].pin);
  refreshState(targetId);
}

void TargetController::enableTarget(byte targetId) {
  spiClient->enable(board->targets[targetId].pin);
  refreshState(targetId);
}

void TargetController::disableTarget(byte targetId) {
  spiClient->disable(board->targets[targetId].pin);
  refreshState(targetId);
}


void TargetController::disableAndBlinkTarget(byte targetId) {
  spiClient->disableAndBlink(board->targets[targetId].pin);
  refreshState(targetId);
}


void TargetController::disableAndBlinkTargets() {
  byte targetCount = (sizeof(board->targets) / sizeof(Target));
  for (byte i = 0; i < targetCount; i++) {
    spiClient->disableAndBlink(board->targets[i].pin);
    refreshState(i);
  }
}


void TargetController::refreshStates() {
  byte targetCount = (sizeof(board->targets) / sizeof(Target));
  for (byte i = 0; i < targetCount; i++) {
    refreshState(i);
  }
}

void TargetController::refreshState(byte targetId) {
  Target* t = &(board->targets[targetId]);
  byte* state = spiClient->getState(t->pin);
  boardStateHandler->refreshState(t->id, state);
  free(state);
}


void TargetController::confirmHit() {
  byte* state = getState();
  this->serialClient->sendTargetHit(state);
  free(state);
  #ifdef DEBUG_MODE
    Serial.println("HIT Confirmed");
  #endif
}


void TargetController::sendCalibrationFinished() {
  byte* state = getState();
  this->serialClient->sendCalibrationFinished(state);
  free(state);
  #ifdef DEBUG_MODE
    Serial.println("Calibration Finished");
  #endif
}

byte* TargetController::getState() {
  byte* state = new byte[CONTROLLER_STATE_SIZE];
  byte i = 0;
  Target* t;
  byte targetCount = (sizeof(board->targets) / sizeof(Target));
  for (byte i = 0; i < targetCount; i++) {
    t = &(board->targets[i]);
    state[3 * i] = t->id;
    state[3 * i + 1] = t->connected + (t->calibrating << 1) + (t->enabled << 2) + (t->hit << 3);
    state[3 * i + 2] = t->tolerance;
  }
  return state;
}


void TargetController::resetTargets() {
  byte targetCount = (sizeof(board->targets) / sizeof(Target));
  for (byte i = 0; i < targetCount; i++) {
    Target* t = &(board->targets[i]);
    spiClient->reset(t->pin);
  }
}
