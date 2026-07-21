const { products } = require('../../utils/data');
const { readTracking, saveOrder } = require('../../utils/tracking');

Page({
  data: {
    product: null,
    form: {
      ownerName: '',
      phone: '',
      petName: '',
      dogBreed: '',
      ageYear: '',
      ageMonth: '',
      city: '',
      hasMedicalHistory: '否',
      agree: false
    }
  },

  onLoad(options) {
    const product = products.find((item) => item.id === options.productId) || products.find((item) => item.id === 'dog-medical-flagship');
    this.setData({ product });
  },

  setOwnerName(event) {
    this.setData({ 'form.ownerName': event.detail.value });
  },

  setPhone(event) {
    this.setData({ 'form.phone': event.detail.value });
  },

  setPetName(event) {
    this.setData({ 'form.petName': event.detail.value });
  },

  setDogBreed(event) {
    this.setData({ 'form.dogBreed': event.detail.value });
  },

  setAgeYear(event) {
    this.setData({ 'form.ageYear': event.detail.value });
  },

  setAgeMonth(event) {
    this.setData({ 'form.ageMonth': event.detail.value });
  },

  setCity(event) {
    this.setData({ 'form.city': event.detail.value });
  },

  setMedicalHistory(event) {
    this.setData({ 'form.hasMedicalHistory': event.detail.value });
  },

  toggleAgree(event) {
    this.setData({ 'form.agree': event.detail.value.length > 0 });
  },

  validate() {
    const { ownerName, phone, petName, dogBreed, ageYear, city, agree } = this.data.form;
    if (!this.data.product) return '当前产品不存在';
    if (!ownerName || !phone || !petName || !dogBreed || ageYear === '' || !city) {
      return '请完整填写投保信息';
    }
    if (!/^1\d{10}$/.test(phone)) {
      return '请输入有效手机号';
    }
    if (!agree) {
      return '请先勾选投保须知';
    }
    return '';
  },

  submitOrder() {
    const message = this.validate();
    if (message) {
      wx.showToast({ title: message, icon: 'none' });
      return;
    }

    const product = this.data.product;
    const form = Object.assign({}, this.data.form, {
      petType: 'dog',
      petTypeLabel: '狗'
    });
    const monthlyPremium = Math.round((product.priceMin + product.priceMax) / 2);
    const annualPremium = monthlyPremium * 12;
    const tracking = readTracking();
    const order = saveOrder({
      productId: product.id,
      productName: product.name,
      companyName: product.companyName,
      monthlyPremium,
      annualPremium,
      form,
      tracking,
      sourcePage: 'order'
    });

    wx.redirectTo({ url: '/pages/order-success/order-success?id=' + order.id });
  }
});
