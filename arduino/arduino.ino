#include "configuration.h"
#include "SerialInboundService.h"
#include "CalibrationController.h"
#include "GameController.h"
#include "LedController.h"
#include "board.h"

Board board = {
  {BTN_RED, false, 0, 0},
  {BTN_BLUE, false, 0, 0},
  {BTN_YELLOW, false, 0, 0},
  {BTN_GREEN, false, 0, 0},
  10
};

CalibrationController calibrationController = CalibrationController(&board);
LedController ledController = LedController();
GameController gameController = GameController(&board, &ledController);
SerialInboundService serialService = SerialInboundService(&gameController, &calibrationController, &ledController);

void setup()
{
    Serial.begin(BAUD_RATE);
    gameController.init();
}

void loop()
{
    // First Priority is checking incoming serial commands
    serialService.tick();
    // If the computer program has not started, no need to go further
    if (!gameController.isConnected() || !gameController.isPaired()) {
      gameController.tick();
      return;
    }

    // Now, we need to ensure target is calibrated
    calibrationController.tick();
    if (calibrationController.shouldCalibrate()) {
      gameController.pause();
      calibrationController.calibrate();
      gameController.resume();
    }
    if (!calibrationController.isCalibrated()) {
      return;
    }

    // Normal game cycle
    gameController.tick();

}
