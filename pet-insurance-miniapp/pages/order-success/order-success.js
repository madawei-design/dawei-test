const { readOrders } = require('../../utils/tracking');

Page({
  data: {
    order: null
  },

  onLoad(options) {
    const orders = readOrders();
    const order = orders.find((item) => item.id === options.id) || null;
    this.setData({ order });
  },

  goProfile() {
    wx.switchTab({ url: '/pages/profile/profile' });
  },

  goProducts() {
    wx.switchTab({ url: '/pages/products/products' });
  }
});
