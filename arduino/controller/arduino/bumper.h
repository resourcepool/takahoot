#include <FastLED.h>

struct Bumper {
    uint8_t id;
    uint8_t pin;
    CRGB color;
    bool connected;
    bool calibrating;
    bool enabled;
    bool hit;
    byte tolerance;
};
