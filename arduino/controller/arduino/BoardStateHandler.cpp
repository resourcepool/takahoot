#include "BoardStateHandler.h"
#include "board.h"
#include "configuration.h"

BoardStateHandler::BoardStateHandler(Board* board) {
  this->board = board;
  this->previousBoard = (Board*) malloc(sizeof(struct Board));
  memcpy(this->previousBoard, this->board, sizeof(struct Board));
}

void BoardStateHandler::init() {
  byte targetCount = (sizeof(board->targets) / sizeof(struct Target));
  for (int i = 0; i < targetCount; i++) {
    pinMode(board->targets[i].pin, OUTPUT);
  }
}

void BoardStateHandler::refreshState(byte id, byte* state) {
  Target* pT = &(previousBoard->targets[id]);
  Target* cT = &(board->targets[id]);
  memcpy(pT, cT, sizeof(struct Target));
  // State is [0b 0000 HEKC, tolerance]
  // H is hit
  // E is enabled
  // K is calibrating
  // C is connected
  cT->connected = state[0] & 0x01;
  cT->calibrating = state[0] & 0x02;
  cT->enabled = state[0] & 0x04;
  cT->hit = state[0] & 0x08;
  cT->tolerance = state[1];
}

bool BoardStateHandler::hasHitChanged() {
  bool r = false;
  byte targetCount = (sizeof(board->targets) / sizeof(struct Target));
  for (int i = 0; i < targetCount; i++) {
    if (board->targets[i].connected && (board->targets[i].hit != previousBoard->targets[i].hit)) {
      r = true;
    }
  }
  return r;
}

bool BoardStateHandler::hasCalibrationChanged() {
  bool r = false;
  byte targetCount = (sizeof(board->targets) / sizeof(struct Target));
  for (int i = 0; i < targetCount; i++) {
    if (board->targets[i].calibrating != previousBoard->targets[i].calibrating) {
      r = true;
    }
  }
  return r;
}

bool BoardStateHandler::isCalibrated() {
  bool r = true;
  byte targetCount = (sizeof(board->targets) / sizeof(struct Target));
  for (int i = 0; i < targetCount; i++) {
    if (board->targets[i].calibrating) {
      r = false;
    }
  }
  return r;
}

bool BoardStateHandler::isHit() {
  bool r = false;
  byte targetCount = (sizeof(board->targets) / sizeof(struct Target));
  for (int i = 0; i < targetCount; i++) {
    if (board->targets[i].hit) {
      r = true;
    }
  }
  #ifdef DEBUG_MODE
  if (r) {
    byte targetCount = (sizeof(board->targets) / sizeof(struct Target));
    for (int i = 0; i < targetCount; i++) {
      if (board->targets[i].hit) {
        #ifdef DEBUG_MODE
        Serial.print("Hit target ");
        Serial.println(board->targets[i].id);
        #endif
      }
    }
  }
  #endif
  return r;
}

void BoardStateHandler::prettyPrint() {
  byte targetCount = (sizeof(board->targets) / sizeof(struct Target));
  Serial.println("-------------------------------");
  for (int i = 0; i < targetCount; i++) {
    Serial.print("Target ");
    Serial.print(board->targets[i].id);
    Serial.print(" connected: ");
    Serial.print(board->targets[i].connected);
    Serial.print(" calibrating: ");
    Serial.print(board->targets[i].calibrating);
    Serial.print(" enabled: ");
    Serial.print(board->targets[i].enabled);
    Serial.print(" hit: ");
    Serial.print(board->targets[i].hit);
    Serial.print(" tolerance: ");
    Serial.print(board->targets[i].tolerance);
    
  }
}
