const { petTypeOptions, cityOptions } = require('../../utils/data');
const { buildRecommendation } = require('../../utils/recommendation');
const { saveLatestQuote } = require('../../utils/tracking');

const yesNoOptions = ['否', '是'];
const budgetOptions = ['基础预算', '均衡保障', '高额保障'];

Page({
  data: {
    petTypeLabels: petTypeOptions.map((item) => item.label),
    cityOptions,
    yesNoOptions,
    budgetOptions,
    form: {
      petType: '',
      petTypeLabel: '',
      petName: '',
      ageYear: '',
      ageMonth: '',
      city: '',
      hasMedicalHistory: '',
      budget: '',
      phone: ''
    }
  },

  changePetType(event) {
    const option = petTypeOptions[Number(event.detail.value)];
    this.setData({
      'form.petType': option.value,
      'form.petTypeLabel': option.label
    });
  },

  changeCity(event) {
    this.setData({ 'form.city': cityOptions[Number(event.detail.value)] });
  },

  changeMedicalHistory(event) {
    this.setData({ 'form.hasMedicalHistory': yesNoOptions[Number(event.detail.value)] });
  },

  changeBudget(event) {
    this.setData({ 'form.budget': budgetOptions[Number(event.detail.value)] });
  },

  setPetName(event) {
    this.setData({ 'form.petName': event.detail.value });
  },

  setAgeYear(event) {
    this.setData({ 'form.ageYear': event.detail.value });
  },

  setAgeMonth(event) {
    this.setData({ 'form.ageMonth': event.detail.value });
  },

  setPhone(event) {
    this.setData({ 'form.phone': event.detail.value });
  },

  validate() {
    const form = this.data.form;
    if (!form.petType || !form.petName || form.ageYear === '' || !form.city || !form.hasMedicalHistory || !form.budget) {
      return '请完整填写宠物信息';
    }
    if (!/^1\d{10}$/.test(form.phone)) {
      return '请输入有效手机号';
    }
    return '';
  },

  submit() {
    const message = this.validate();
    if (message) {
      wx.showToast({ title: message, icon: 'none' });
      return;
    }

    const form = Object.assign({}, this.data.form);
    const recommendation = buildRecommendation(form);
    saveLatestQuote({ form, recommendation });
    wx.navigateTo({ url: '/pages/result/result' });
  }
});
