#ifndef BAUD_RATE
#define BAUD_RATE 115200
#endif

//#define DEBUG_MODE

#define BTN_RED A0
#define BTN_BLUE A1
#define BTN_YELLOW A2
#define BTN_GREEN A3
#define POT_THRESHOLD A4
#define BTN_CALIBRATE A4

#define LED_RED_PIN 13
#define LED_YELLOW_PIN 14
#define LED_GREEN_PIN 15

const float MAX_TOLERANCE_FLOAT = 20.0;
const float TOLERANCE_RATIO = MAX_TOLERANCE_FLOAT / 1023.0;

const int MAX_THRESHOLD = 660;
const float MAX_THRESHOLD_FLOAT = (float) MAX_THRESHOLD;
const float THRESHOLD_RATIO = MAX_THRESHOLD_FLOAT / 1023.0; // Force sensors have a max value of 660
