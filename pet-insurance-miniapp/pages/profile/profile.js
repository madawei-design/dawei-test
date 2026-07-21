const { readLatestQuote, readLeads, readOrders } = require('../../utils/tracking');

Page({
  data: {
    latestQuote: null,
    leads: [],
    orders: []
  },

  onShow() {
    this.setData({
      latestQuote: readLatestQuote(),
      leads: readLeads(),
      orders: readOrders()
    });
  },

  goQuote() {
    wx.navigateTo({ url: '/pages/quote/quote' });
  }
});
