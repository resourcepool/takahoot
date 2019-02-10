#include "LedController.h"
#include "board.h"
#include "configuration.h"

LedController::LedController() {
  this->isBlinking = false;
  this->lastBlink = millis();
  this->lastBlinkValue = false;
}

void LedController::reset() {
  digitalWrite(LED_RED_PIN, LOW);
  digitalWrite(LED_YELLOW_PIN, LOW);
  digitalWrite(LED_GREEN_PIN, LOW);
}

void LedController::setConnected(bool connected) {
  reset();
  if (connected) {
    digitalWrite(LED_RED_PIN, HIGH);
    digitalWrite(LED_YELLOW_PIN, HIGH);
    digitalWrite(LED_GREEN_PIN, HIGH);
  }
}

void LedController::setPairingStarted() {
  reset();
  isBlinking = true;
  lastBlink = millis();
  lastBlinkValue = false;
  #ifdef DEBUG_MODE
    Serial.println("Pairing started");
  #endif
}

void LedController::setPairingFinished() {
  reset();
  isBlinking = false;
  digitalWrite(LED_RED_PIN, HIGH);
  #ifdef DEBUG_MODE
    Serial.println("Led Red is high");
  #endif
}

void LedController::setReady(bool ready) {
  reset();
  if (ready) {
    digitalWrite(LED_YELLOW_PIN, HIGH);
    #ifdef DEBUG_MODE
      Serial.println("Led Yellow is high");
    #endif
  } else {
    digitalWrite(LED_RED_PIN, HIGH);
    #ifdef DEBUG_MODE
      Serial.println("Led Red is high");
    #endif
  }
}

void LedController::setHit(bool hit) {
  reset();
  if (hit) {
    digitalWrite(LED_GREEN_PIN, HIGH);
    #ifdef DEBUG_MODE
      Serial.println("Led Green is high");
    #endif
  } else {
    digitalWrite(LED_YELLOW_PIN, HIGH);
    #ifdef DEBUG_MODE
      Serial.println("Led Yellow is high");
    #endif
  }
}

void LedController::tick() {
  if (isBlinking) {
    tickBlink();
  }
}

void LedController::tickBlink() {
  if ((millis() - lastBlink) < LED_BLINK_TIME_MS) {
    return;
  }
  lastBlink = millis();
  lastBlinkValue = !lastBlinkValue;
  digitalWrite(LED_RED_PIN, lastBlinkValue ? LOW : HIGH);
  digitalWrite(LED_YELLOW_PIN, lastBlinkValue ? LOW : HIGH);
  digitalWrite(LED_GREEN_PIN, lastBlinkValue ? LOW : HIGH);
  #ifdef DEBUG_MODE
    Serial.print("Leds are Blinking ");
    Serial.println(lastBlinkValue ? "ON" : "OFF");
  #endif
}
