const { readLatestQuote, readLeads, readOrders, readFeedingAppointments } = require('../../utils/tracking');

Page({
  data: {
    latestQuote: null,
    leads: [],
    orders: [],
    feedingAppointments: []
  },

  onShow() {
    this.setData({
      latestQuote: readLatestQuote(),
      leads: readLeads(),
      orders: readOrders(),
      feedingAppointments: readFeedingAppointments()
    });
  },

  goQuote() {
    wx.navigateTo({ url: '/pages/quote/quote' });
  },

  goFeeding() {
    wx.navigateTo({ url: '/pages/feeding/feeding' });
  }
});
