#include <Arduino.h>

class GameController;

// All outbound message commands start with 0011 <=> 48
#define IN_COMPUTER_CONNECTED 0x30 // <=> 0011 0000
#define IN_GAME_RESET 0x31 // <=> 0011 0001

class SerialInboundService {
public:
  SerialInboundService(GameController* gameController);
  void tick();
private:
  GameController* gameController;

};
