#include "configuration.h"
#include "SerialClient.h"
#include "TargetController.h"
#include "SPIClient.h"
#include "board.h"

Board board = {
  {
    {TARGET_1_ID, TARGET_1_PIN, CRGB(TARGET_1_COLOR), false, false, false, false, 0},
    {TARGET_2_ID, TARGET_2_PIN, CRGB(TARGET_2_COLOR), false, false, false, false, 0},
    {TARGET_3_ID, TARGET_3_PIN, CRGB(TARGET_3_COLOR), false, false, false, false, 0},
    {TARGET_4_ID, TARGET_4_PIN, CRGB(TARGET_4_COLOR), false, false, false, false, 0}
  }
};

SPIClient spiClient = SPIClient();
SerialClient serialClient = SerialClient();
TargetController ctrl = TargetController(&board, &spiClient, &serialClient);

void setup() {
  ctrl.init();
}

void loop() {
    ctrl.tick();
}
