const { readLatestQuote, readTracking, saveLead } = require('../../utils/tracking');

Page({
  data: {
    quote: null,
    items: []
  },

  onShow() {
    const quote = readLatestQuote();
    this.setData({
      quote,
      items: quote ? quote.recommendation.items : []
    });
  },

  goDetail(event) {
    wx.navigateTo({ url: '/pages/product-detail/product-detail?id=' + event.currentTarget.dataset.id });
  },

  saveConsultLead() {
    this.persistLead('');
  },

  saveAndApply(event) {
    this.persistLead(event.currentTarget.dataset.id);
  },

  persistLead(productId) {
    const quote = this.data.quote;
    if (!quote) return;

    const tracking = readTracking();
    const lead = saveLead({
      form: quote.form,
      productId,
      tracking,
      status: '待跟进',
      sourcePage: 'result'
    });

    wx.showModal({
      title: '已提交',
      content: '线索编号：' + lead.id + '。顾问将根据宠物情况协助确认投保。',
      showCancel: false,
      success() {
        wx.switchTab({ url: '/pages/profile/profile' });
      }
    });
  }
});
