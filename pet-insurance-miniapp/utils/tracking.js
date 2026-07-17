const TRACKING_KEY = 'pet_insurance_tracking';
const LEADS_KEY = 'pet_insurance_leads';
const QUOTE_KEY = 'pet_insurance_latest_quote';

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

module.exports = {
  readTracking,
  writeTracking,
  saveLatestQuote,
  readLatestQuote,
  saveLead,
  readLeads
};
