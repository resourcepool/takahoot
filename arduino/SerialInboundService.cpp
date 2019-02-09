#include "SerialInboundService.h"
#include "GameController.h"
#include "configuration.h"
#include "board.h"

SerialInboundService::SerialInboundService(GameController* gameController) {
  this->gameController = gameController;
}

void SerialInboundService::tick() {
  if (Serial.available() > 0) {
    byte cmd = Serial.read();
    switch (cmd) {
      case IN_COMPUTER_CONNECTED:
        this->gameController->setConnected(true);
        break;
      case IN_COMPUTER_PAIRED:
        this->gameController->setPaired(true);
        break;
      case IN_COMPUTER_UNPAIRED:
        this->gameController->setPaired(false);
        break;
      case IN_GAME_RESET:
        this->gameController->reset();
        break;
    }
  }
}
