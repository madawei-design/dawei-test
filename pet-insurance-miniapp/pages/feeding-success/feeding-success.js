const { readFeedingAppointments } = require('../../utils/tracking');

Page({
  data: {
    appointment: null
  },

  onLoad(options) {
    const appointments = readFeedingAppointments();
    const appointment = appointments.find((item) => item.id === options.id) || null;
    this.setData({ appointment });
  },

  goProfile() {
    wx.switchTab({ url: '/pages/profile/profile' });
  },

  goHome() {
    wx.switchTab({ url: '/pages/home/home' });
  }
});
