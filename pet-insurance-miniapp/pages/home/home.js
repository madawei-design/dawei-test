const { products } = require('../../utils/data');

Page({
  data: {
    hotProducts: [],
    tracking: {},
    featuredDogProductId: 'dog-medical-flagship'
  },

  onLoad(options) {
    const app = getApp();
    let tracking = readTracking();
    if (options && options.scene) {
      tracking = writeTracking(decodeURIComponent(options.scene));
      app.globalData.tracking = tracking;
    }
    this.setData({
      hotProducts: products.slice(0, 3),
      tracking
    });
  },

  goQuote() {
    wx.navigateTo({ url: '/pages/quote/quote' });
  },

  goProducts() {
    wx.switchTab({ url: '/pages/products/products' });
  },

  goDetail(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/product-detail/product-detail?id=' + id });
  },

  goDogOrder() {
    wx.navigateTo({ url: '/pages/order/order?productId=' + this.data.featuredDogProductId });
  }
});
