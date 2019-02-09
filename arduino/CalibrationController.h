#include <Arduino.h>

struct Board;
struct Trigger;

#ifndef CALIBRATION_IT_COUNT
#define CALIBRATION_IT_COUNT 1000
#endif

class SerialOutboundService;

class CalibrationController {
public:
  CalibrationController(Board* board);
  bool shouldCalibrate();
  bool isCalibrated();
  void calibrate();
  void tick();
private:
  bool calibrated;
  Board* board;
  SerialOutboundService* serialService;
  void calibrate(Trigger* trigger);
};
