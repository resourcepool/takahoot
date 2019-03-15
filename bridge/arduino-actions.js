module.exports.OUT = {
  "CONNECTING": Buffer.from([0x30]),
  "START_PAIRING": Buffer.from([0x31]),
  "FINISH_PAIRING": Buffer.from([0x32]),
  "START_CALIBRATION": Buffer.from([0x33]),
  "GAME_RESET": Buffer.from([0x34])
};
module.exports.IN = {
  "INITIALIZED": Buffer.from([0xc0]),
  "CONNECTED": Buffer.from([0xC1]),
  "CALIBRATION_STARTED": Buffer.from([0xC2]),
  "CALIBRATION_FINISHED": Buffer.from([0xC3]),
  "HIT": Buffer.from([0xC4]),
  "TOLERANCE_CHANGED": Buffer.from([0xC5]),
  "END_MESSAGE": Buffer.from([0x0D, 0x0A])
};
