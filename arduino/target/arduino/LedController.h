#include <Arduino.h>
#include <FastLED.h>

#define LED_BLINK_TIME_MS 1000
#define LED_ANIMATE_TIME_MS 30
#define NUM_LEDS 16
#define BRIGHTNESS 255
#define LED_TYPE    NEOPIXEL

struct Board;
struct Trigger;
class BoardStateHandler;

class LedController {
public:
  LedController();
  void setConnected(bool connected);
  void setReady(bool ready);
  void setColor(CRGB rgb);
  void blinkColor(CRGB rgb);
  void animateColor(CRGB rgb);
  void tick();
private:
  bool isConnected;
  bool isBlinking;
  long lastBlink;
  bool lastBlinkValue;
  void tickBlink();
  void reset();
  CRGB color;
  CRGB leds[NUM_LEDS];
  CRGBPalette16 palette;
  TBlendType blending;
  CRGBPalette16 computeBlackPalette();
  CRGBPalette16 computeSingleColorPalette(CRGB color);
  CRGBPalette16 computeWaveColorPalette(CRGB color);
};
