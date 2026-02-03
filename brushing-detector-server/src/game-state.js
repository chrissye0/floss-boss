//Arduino code for brush motion

const gameState = {
  // original brushing
  activeToothIndex: null,
  isBrushing: false,
  sensorValues: [],

  // device-specific data
  devices: {
    arduino1: {
      activeToothIndex: null,
      isBrushing: false,
      sensorValues: []
    },
    arduino2: {
      flossToothIndex: null,
      isFlossing: false,
      sensorValues: []
    }
  }
};

module.exports = gameState;

