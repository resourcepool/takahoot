#include <Arduino.h>

struct Board;

// All outbound message commands start with 1100 <=> 192
#define OUT_DEVICE_CONNECTED 0xC0 // <=> 1100 0000
#define OUT_DEVICE_CALIBRATION_STARTED 0xC1 // <=> 1100 0001
#define OUT_DEVICE_CALIBRATION_FINISHED 0xC2 // <=> 1100 0002
#define OUT_TARGET_HIT 0xC3 // <=> 1100 0003
#define OUT_TOLERANCE_CHANGED 0xC4 // <=> 1100 0004

class SerialOutboundService {
public:
  SerialOutboundService(Board* board);
  /**
   * Device Connected is a one-byte message with command OUT_DEVICE_CONNECTED
   */
  void sendDeviceConnectedMessage();
  /**
   * Device Calibration Started is a one-byte message with command OUT_DEVICE_CALIBRATION_STARTED
   */
  void sendDeviceCalibrationStartedMessage();
  /**
   * Device Calibration Finished is a one-byte message with command OUT_DEVICE_CALIBRATION_FINISHED
   */
  void sendDeviceCalibrationFinishedMessage();
  /*
   * Target hit is a two-byte message.
   * it starts with the command byte OUT_TARGET_HIT
   * and is followed by a value byte 0000GYBR
   * R is red (1 is high <=> triggered, 0 is low <=> idle)
   * B is blue (1 is high <=> triggered, 0 is low <=> idle)
   * Y is yellow (1 is high <=> triggered, 0 is low <=> idle)
   * G is green (1 is high <=> triggered, 0 is low <=> idle)
   */
  void sendTargetHitMessage();
  /*
   * Board state message is a two-byte message.
   * it starts with the command byte OUT_TOLERANCE_CHANGED
   * and is followed by a value byte XXXXXXXX
   * XXXXXXXX is the current tolerance. It goes from 0 to 100.
   */
  void sendToleranceChangedMessage();
private:
  Board* board;
  const byte END_MESSAGE[2] = { 0x0D, 0x0A };
  const byte END_MESSAGE_SIZE = 2;
};
