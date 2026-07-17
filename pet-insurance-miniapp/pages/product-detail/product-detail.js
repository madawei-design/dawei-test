const { products } = require('../../utils/data');

Page({
  data: {
    product: null
  },

  onLoad(options) {
    const product = products.find((item) => item.id === options.id);
    this.setData({ product });
  },

  goQuote() {
    wx.navigateTo({ url: '/pages/quote/quote?productId=' + this.data.product.id });
  },

  goProducts() {
    wx.switchTab({ url: '/pages/products/products' });
  }
});
