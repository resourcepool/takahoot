#include "SerialClient.h"
#include "TargetController.h"
#include "configuration.h"
#include "board.h"

SerialClient::SerialClient() {
}

void SerialClient::init(TargetController* ctrl) {
  
  while (!WebUSBSerial) {
    ;
  }
  WebUSBSerial.begin(BAUD_RATE);
  Serial.begin(BAUD_RATE);
  this->ctrl = ctrl;
}

void SerialClient::tick() {
  if (WebUSBSerial.available() > 0) {
    byte cmd = WebUSBSerial.read();
    onRequest(cmd);
  }
}

void SerialClient::sendConnected(byte* state) {
  WebUSBSerial.write(OUT_COMPUTER_CONNECTED);
  WebUSBSerial.write(state, CONTROLLER_STATE_SIZE);
  WebUSBSerial.write(END_MESSAGE, END_MESSAGE_SIZE);
}

void SerialClient::sendCalibrationStarted() {
  WebUSBSerial.write(OUT_COMPUTER_CALIBRATION_STARTED);
  WebUSBSerial.write(END_MESSAGE, END_MESSAGE_SIZE);
}

void SerialClient::sendCalibrationFinished(byte* state) {
  WebUSBSerial.write(OUT_COMPUTER_CALIBRATION_FINISHED);
  WebUSBSerial.write(state, CONTROLLER_STATE_SIZE);
  WebUSBSerial.write(END_MESSAGE, END_MESSAGE_SIZE);
}

void SerialClient::sendTargetHit(byte* state) {
  WebUSBSerial.write(OUT_COMPUTER_TARGET_HIT);
  WebUSBSerial.write(state, CONTROLLER_STATE_SIZE);
  WebUSBSerial.write(END_MESSAGE, END_MESSAGE_SIZE);
}


void SerialClient::sendState(byte* state) {
  WebUSBSerial.write(OUT_COMPUTER_CONTROLLER_STATE);
  WebUSBSerial.write(state, CONTROLLER_STATE_SIZE);
  WebUSBSerial.write(END_MESSAGE, END_MESSAGE_SIZE);
}

void SerialClient::onRequest(byte cmd) {
  if (!parsing) {
      switch (cmd) {
        // 1-byte commands
        case IN_COMPUTER_CONNECTED:
        case IN_COMPUTER_DISABLE_TARGETS_AND_BLINK:
        case IN_COMPUTER_GET_STATE:
        case IN_COMPUTER_RESET:
          buffer[0] = cmd;
          processCommand();
          break;
        // 2-byte commands
        case IN_COMPUTER_START_CALIBRATION:
        case IN_COMPUTER_ENABLE_TARGET:
        case IN_COMPUTER_DISABLE_TARGET:
        case IN_COMPUTER_DISABLE_TARGET_AND_BLINK:
          buffer[0] = cmd;
          parsing = true;
          total = 1;
          break;
        // 3-byte commands
        case IN_COMPUTER_CHANGE_TOLERANCE:
          buffer[0] = cmd;
          parsing = true;
          total = 2;
          break;
        // 4-byte commands
      }
    } else {
      buffer[1 + currentIndex] = cmd;
      if (++currentIndex == total) {
        currentIndex = 0;
        parsing = false;
        return processCommand();
      }
    }
    return END_MESSAGE;
}

void SerialClient::processCommand() {
  switch (buffer[0]) {
    case IN_COMPUTER_CONNECTED:
      #ifdef DEBUG_MODE
      Serial.println("Received command IN_COMPUTER_CONNECTED");
      #endif
      ctrl->setConnected(true);
      #ifdef DEBUG_MODE
      Serial.println("Done");
      #endif
      break;
    case IN_COMPUTER_START_CALIBRATION:
      #ifdef DEBUG_MODE
      Serial.print("Received command IN_COMPUTER_START_CALIBRATION(");
      Serial.print(buffer[1]);
      Serial.println(")");
      #endif
      ctrl->startCalibration(buffer[1]);
      #ifdef DEBUG_MODE
      Serial.println("Done");
      #endif
      break;
    case IN_COMPUTER_CHANGE_TOLERANCE:
      #ifdef DEBUG_MODE
      Serial.print("Received command IN_COMPUTER_CHANGE_TOLERANCE(");
      Serial.print(buffer[1]);
      Serial.print(", ");
      Serial.print(buffer[2]);
      Serial.println(")");
      #endif
      ctrl->changeTolerance(buffer[1], buffer[2]);
      #ifdef DEBUG_MODE
      Serial.print("Tolerance changed for target ");
      Serial.println(buffer[1]);
      #endif
      break;
    case IN_COMPUTER_ENABLE_TARGET:
      #ifdef DEBUG_MODE
      Serial.print("Received command IN_COMPUTER_ENABLE_TARGET(");
      Serial.print(buffer[1]);
      Serial.println(")");
      #endif
      ctrl->enableTarget(buffer[1]);
      #ifdef DEBUG_MODE
      Serial.println("Done");
      #endif
      break;
    case IN_COMPUTER_DISABLE_TARGET:
      #ifdef DEBUG_MODE
      Serial.print("Received command IN_COMPUTER_DISABLE_TARGET(");
      Serial.print(buffer[1]);
      Serial.println(")");
      #endif
      ctrl->disableTarget(buffer[1]);
      #ifdef DEBUG_MODE
      Serial.println("Done");
      #endif
      break;
    case IN_COMPUTER_DISABLE_TARGET_AND_BLINK:
      #ifdef DEBUG_MODE
      Serial.print("Received command IN_COMPUTER_DISABLE_TARGET_AND_BLINK(");
      Serial.print(buffer[1]);
      Serial.println(")");
      #endif
      ctrl->disableAndBlinkTarget(buffer[1]);
      #ifdef DEBUG_MODE
      Serial.println("Done");
      #endif
      break;
    case IN_COMPUTER_DISABLE_TARGETS_AND_BLINK:
      #ifdef DEBUG_MODE
      Serial.println("Received command IN_COMPUTER_DISABLE_TARGETS_AND_BLINK");
      #endif
      ctrl->disableAndBlinkTargets();
      #ifdef DEBUG_MODE
      Serial.println("Done");
      #endif
      break;
    case IN_COMPUTER_GET_STATE:
      #ifdef DEBUG_MODE
      Serial.println("Received command IN_COMPUTER_GET_STATE");
      #endif
      byte* state = ctrl->getState();
      sendState(state);
      free(state);
      #ifdef DEBUG_MODE
      Serial.println("Done");
      #endif
      break;
    case IN_COMPUTER_RESET:
      #ifdef DEBUG_MODE
      Serial.println("Received command IN_COMPUTER_RESET");
      #endif
      ctrl->resetTargets();
      asm volatile ("  jmp 0"); 
      #ifdef DEBUG_MODE
      Serial.println("Done");
      #endif
      break;
  }
}
