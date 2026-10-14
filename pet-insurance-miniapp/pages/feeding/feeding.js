const { readTracking, saveFeedingAppointment } = require('../../utils/tracking');

const petTypeOptions = ['猫', '狗', '兔子', '鸟类', '其他'];
const petCountOptions = ['1只', '2只', '3只', '4只', '5只及以上'];
const timeSlotOptions = ['上午 9:00-12:00', '下午 12:00-18:00', '晚上 18:00-21:00'];

Page({
  data: {
    petTypeOptions,
    petCountOptions,
    timeSlotOptions,
    form: {
      petType: '',
      petName: '',
      petCount: '',
      serviceDate: '',
      timeSlot: '',
      address: '',
      contactName: '',
      phone: '',
      remark: '',
      agree: false
    }
  },

  changePetType(event) {
    this.setData({ 'form.petType': petTypeOptions[Number(event.detail.value)] });
  },

  changePetCount(event) {
    this.setData({ 'form.petCount': petCountOptions[Number(event.detail.value)] });
  },

  changeServiceDate(event) {
    this.setData({ 'form.serviceDate': event.detail.value });
  },

  changeTimeSlot(event) {
    this.setData({ 'form.timeSlot': timeSlotOptions[Number(event.detail.value)] });
  },

  setPetName(event) {
    this.setData({ 'form.petName': event.detail.value });
  },

  setAddress(event) {
    this.setData({ 'form.address': event.detail.value });
  },

  setContactName(event) {
    this.setData({ 'form.contactName': event.detail.value });
  },

  setPhone(event) {
    this.setData({ 'form.phone': event.detail.value });
  },

  setRemark(event) {
    this.setData({ 'form.remark': event.detail.value });
  },

  toggleAgree(event) {
    this.setData({ 'form.agree': event.detail.value.length > 0 });
  },

  validate() {
    const f = this.data.form;
    if (!f.petType || !f.petName || !f.petCount || !f.serviceDate || !f.timeSlot || !f.address || !f.contactName) {
      return '请完整填写预约信息';
    }
    if (!/^1\d{10}$/.test(f.phone)) {
      return '请输入有效手机号';
    }
    if (!f.agree) {
      return '请先勾选服务协议';
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
    const tracking = readTracking();
    const appointment = saveFeedingAppointment({ form, tracking, sourcePage: 'feeding' });

    wx.redirectTo({ url: '/pages/feeding-success/feeding-success?id=' + appointment.id });
  }
});
