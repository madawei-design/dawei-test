const { products } = require('../../utils/data');

Page({
  data: {
    activeType: 'all',
    filteredProducts: products
  },

  setType(event) {
    const activeType = event.currentTarget.dataset.type;
    const filteredProducts = activeType === 'all'
      ? products
      : products.filter((item) => item.petTypes.indexOf(activeType) >= 0);
    this.setData({ activeType, filteredProducts });
  },

  goDetail(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/product-detail/product-detail?id=' + id });
  }
});
