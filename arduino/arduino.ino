#include "configuration.h"
#include "SerialInboundService.h"
#include "CalibrationController.h"
#include "GameController.h"
#include "board.h"

Board board = {
  {BTN_RED, false, 0, 0},
  {BTN_BLUE, false, 0, 0},
  {BTN_YELLOW, false, 0, 0},
  {BTN_GREEN, false, 0, 0},
  10
};

CalibrationController calibrationController = CalibrationController(&board);
GameController gameController = GameController(&board);
SerialInboundService serialService = SerialInboundService(&gameController);

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
