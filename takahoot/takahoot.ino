const int BTN_RED = A0;
const int BTN_BLUE = A1;
const int BTN_YELLOW = A2;
const int BTN_GREEN = A3;
const int POT_THRESHOLD = A4; // TODO soon to be deprecated

const int BTN_CALIBRATE = A4;

const float MAX_TOLERANCE_FLOAT = 20.0;
const float TOLERANCE_RATIO = MAX_TOLERANCE_FLOAT / 1023.0;

const int MAX_THRESHOLD = 660;
const float MAX_THRESHOLD_FLOAT = (float) MAX_THRESHOLD;
const float THRESHOLD_RATIO = MAX_THRESHOLD_FLOAT / 1023.0; // Force sensors have a max value of 660

// Board state message is a byte that starts with 11XXGYBR <=> 0xC0 <=> 192
// R is red (1 is high <=> triggered, 0 is low <=> idle)
// B is blue (1 is high <=> triggered, 0 is low <=> idle)
// Y is yellow (1 is high <=> triggered, 0 is low <=> idle)
// G is green (1 is high <=> triggered, 0 is low <=> idle)
const byte BOARD_STATE_MSG = 192;
// Board tolerance message is a byte that starts with 10XXXXXX <=> 0x80 <=> 128
// XXXXX is the current tolerance. It goes from 0 to 20.
const byte BOARD_TOLERANCE_MSG = 128;

struct Trigger {
    int btn;
    bool state;
    int threshold;
    int value;
};

struct Board {
  Trigger red;
  Trigger blue;
  Trigger yellow;
  Trigger green;
  int tolerance;
};


Board board = {
  {BTN_RED, false, 0, 0},
  {BTN_BLUE, false, 0, 0},
  {BTN_YELLOW, false, 0, 0},
  {BTN_GREEN, false, 0, 0},
  10
};

bool shouldCalibrate = 0;
bool calibrated = false;
byte previousState = BOARD_STATE_MSG;

void setup()
{
    pinMode(board.red.btn, INPUT);
    pinMode(board.blue.btn, INPUT);
    pinMode(board.yellow.btn, INPUT);
    pinMode(board.green.btn, INPUT);
    Serial.begin(115200);
}

void calibrate() {
  Serial.print("Calibration will start in 5...");
  for (int d = 4; d > 0; d--) {
    Serial.print(d);
    Serial.print("...");
    delay(1000);
  }
  Serial.println();
  Serial.println("Calibration started");
  calibrate(&(board.red));
  calibrate(&(board.blue));
  calibrate(&(board.yellow));
  calibrate(&(board.green));
  Serial.println("Calibration finished");
}

void calibrate(Trigger* trigger) {
  int threshold = 0;
  int maxThreshold = 0;
  int loops = 0;
  int lastVal = 0;
  for (loops = 0; loops < 1000; loops++) {
    lastVal = analogRead(trigger->btn);
    if (lastVal > maxThreshold) {
      maxThreshold = lastVal;
    }
    threshold += lastVal;
    delay(2);
  }
  Serial.println("New threshold is ");
  trigger->threshold = maxThreshold;
  Serial.println(trigger->threshold);
}

void refreshState() {
  refreshState(&(board.red), board.tolerance);
  refreshState(&(board.blue), board.tolerance);
  refreshState(&(board.yellow), board.tolerance);
  refreshState(&(board.green), board.tolerance);
}

void refreshState(Trigger* trigger, int tolerance) {
  int analogValue = analogRead(trigger->btn);
  bool newState = (analogValue > (trigger->threshold + tolerance));
  trigger->state = newState;
  trigger->value = analogValue;
}

byte encodeStateMessage() {
  return BOARD_STATE_MSG + (board.red.state ? 0x01 : 0x00) + (board.blue.state ? 0x02 : 0x00) + (board.yellow.state ? 0x04 : 0x00) + (board.green.state ? 0x08 : 0x00);
}

byte encodeToleranceMessage() {
  return BOARD_TOLERANCE_MSG + board.tolerance;
}

void sendToleranceMessage() {
  Serial.println(encodeToleranceMessage());
}

void sendStateMessage() {
  Serial.println(encodeStateMessage());
}

void loop()
{
    int tolerance = (int) (analogRead(POT_THRESHOLD) * TOLERANCE_RATIO);
    if (tolerance != board.tolerance) {
      Serial.print("Tolerance has changed to:");
      Serial.println(tolerance);
      board.tolerance = tolerance;
    }
    // FIXME
    // shouldCalibrate = digitalRead(BTN_CALIBRATE);
    shouldCalibrate = !calibrated;
    if (shouldCalibrate == HIGH) {
      calibrate();
      calibrated = true;
    }

    if (!calibrated) {
      return;
    }

    refreshState();
    if (board.blue.state) {
      Serial.println("HIT");
      sendStateMessage();
    }
}
