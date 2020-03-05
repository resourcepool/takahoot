#include <Arduino.h>

struct Board;
struct Trigger;

#ifndef CALIBRATION_IT_COUNT
#define CALIBRATION_IT_COUNT 1000
#endif

class Calibrator {
public:
  Calibrator(Trigger* trigger);
  void start();
  void reset();
  bool isCalibrating();
  bool isDone();
  bool hasCalibrationStateChanged();
  void tick();
private:
  int threshold;
  int maxThreshold;
  int loops;
  int lastVal;
  bool done;
  Trigger* trigger;
};
