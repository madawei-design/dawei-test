const { readLatestQuote, readLeads } = require('../../utils/tracking');

Page({
  data: {
    latestQuote: null,
    leads: []
  },

  onShow() {
    this.setData({
      latestQuote: readLatestQuote(),
      leads: readLeads()
    });
  },

  goQuote() {
    wx.navigateTo({ url: '/pages/quote/quote' });
  }
});
