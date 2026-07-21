const { products } = require('../../utils/data');

Page({
  data: {
    product: null,
    isDirectOrder: false
  },

  onLoad(options) {
    const product = products.find((item) => item.id === options.id);
    this.setData({
      product,
      isDirectOrder: product && product.id === 'dog-medical-flagship'
    });
  },

  goQuote() {
    wx.navigateTo({ url: '/pages/quote/quote?productId=' + this.data.product.id });
  },

  goProducts() {
    wx.switchTab({ url: '/pages/products/products' });
  },

  goOrder() {
    wx.navigateTo({ url: '/pages/order/order?productId=' + this.data.product.id });
  }
});
