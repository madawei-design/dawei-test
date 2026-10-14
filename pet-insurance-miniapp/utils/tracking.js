const TRACKING_KEY = 'pet_insurance_tracking';
const LEADS_KEY = 'pet_insurance_leads';
const QUOTE_KEY = 'pet_insurance_latest_quote';
const ORDER_KEY = 'pet_insurance_orders';
const FEEDING_KEY = 'pet_feeding_appointments';

function readTracking() {
  return wx.getStorageSync(TRACKING_KEY) || {};
}

function writeTracking(scene) {
  const tracking = {
    scene,
    channelId: parseScene(scene, 'channel'),
    promoterId: parseScene(scene, 'promoter'),
    firstVisitedAt: new Date().toISOString()
  };
  wx.setStorageSync(TRACKING_KEY, tracking);
  return tracking;
}

function parseScene(scene, prefix) {
  if (!scene || scene.indexOf(prefix + '_') !== 0) return '';
  return scene.replace(prefix + '_', '');
}

function saveLatestQuote(payload) {
  wx.setStorageSync(QUOTE_KEY, payload);
}

function readLatestQuote() {
  return wx.getStorageSync(QUOTE_KEY) || null;
}

function saveLead(lead) {
  const leads = wx.getStorageSync(LEADS_KEY) || [];
  const nextLead = Object.assign({}, lead, {
    id: 'lead_' + Date.now(),
    createdAt: new Date().toISOString()
  });
  leads.unshift(nextLead);
  wx.setStorageSync(LEADS_KEY, leads.slice(0, 50));
  return nextLead;
}

function readLeads() {
  return wx.getStorageSync(LEADS_KEY) || [];
}

function saveOrder(order) {
  const orders = wx.getStorageSync(ORDER_KEY) || [];
  const nextOrder = Object.assign({}, order, {
    id: 'order_' + Date.now(),
    createdAt: new Date().toISOString(),
    status: '待支付确认'
  });
  orders.unshift(nextOrder);
  wx.setStorageSync(ORDER_KEY, orders.slice(0, 50));
  return nextOrder;
}

function readOrders() {
  return wx.getStorageSync(ORDER_KEY) || [];
}

function saveFeedingAppointment(appointment) {
  const appointments = wx.getStorageSync(FEEDING_KEY) || [];
  const nextAppointment = Object.assign({}, appointment, {
    id: 'feeding_' + Date.now(),
    createdAt: new Date().toISOString(),
    status: '待接单'
  });
  appointments.unshift(nextAppointment);
  wx.setStorageSync(FEEDING_KEY, appointments.slice(0, 50));
  return nextAppointment;
}

function readFeedingAppointments() {
  return wx.getStorageSync(FEEDING_KEY) || [];
}

module.exports = {
  readTracking,
  writeTracking,
  saveLatestQuote,
  readLatestQuote,
  saveLead,
  readLeads,
  saveOrder,
  readOrders,
  saveFeedingAppointment,
  readFeedingAppointments
};
