#include "SerialInboundService.h"
#include "GameController.h"
#include "CalibrationController.h"
#include "LedController.h"
#include "configuration.h"
#include "board.h"

SerialInboundService::SerialInboundService(GameController* gameController, CalibrationController* calibrationController, LedController* ledController) {
  this->gameController = gameController;
  this->calibrationController = calibrationController;
  this->ledController = ledController;
}

void SerialInboundService::tick() {
  if (Serial.available() > 0) {
    byte cmd = Serial.read();
    switch (cmd) {
      case IN_COMPUTER_CONNECTED:
        this->gameController->setConnected(true);
        break;
      case IN_COMPUTER_START_PAIRING:
        this->gameController->setPairingStarted();
        break;
      case IN_COMPUTER_FINISH_PAIRING:
        this->gameController->setPairingFinished();
        break;
      case IN_COMPUTER_START_CALIBRATION:
        this->ledController->setReady(false);
        this->calibrationController->calibrate();
        this->ledController->setReady(true);
        break;
      case IN_GAME_RESET:
        this->gameController->reset();
        break;
    }
  }
}
