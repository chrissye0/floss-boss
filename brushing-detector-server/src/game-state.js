//Arduino code for brush motion

const gameState = {
  // original brushing
  activeToothIndex: null,
  isBrushing: false,
  sensorValues: [],

  // device-specific data
    flossing: {
      flossToothIndex: null,
      isFlossing: false,
      sensorValues: []
    }
};

module.exports = gameState;

