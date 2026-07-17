const { readTracking, writeTracking } = require('./utils/tracking');

App({
  globalData: {
    tracking: readTracking()
  },

  onLaunch(options) {
    const scene = options && options.query ? options.query.scene : '';
    if (scene) {
      this.globalData.tracking = writeTracking(scene);
    }
  }
});
