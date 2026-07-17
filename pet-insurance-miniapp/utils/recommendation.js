const { products } = require('./data');

function getAgeMonth(ageYear, ageMonth) {
  return Number(ageYear || 0) * 12 + Number(ageMonth || 0);
}

function estimatePrice(product, form) {
  const ageMonth = getAgeMonth(form.ageYear, form.ageMonth);
  const ageFactor = ageMonth >= 84 ? 1.35 : ageMonth <= 12 ? 0.9 : 1;
  const cityFactor = ['北京', '上海', '深圳'].indexOf(form.city) >= 0 ? 1.12 : 1;
  const historyFactor = form.hasMedicalHistory === '是' ? 1.2 : 1;
  const base = (product.priceMin + product.priceMax) / 2;
  return Math.round(base * ageFactor * cityFactor * historyFactor);
}

function scoreProduct(product, form) {
  const ageMonth = getAgeMonth(form.ageYear, form.ageMonth);
  let score = product.recommendWeight;

  if (product.petTypes.indexOf(form.petType) === -1) return -1;
  if (ageMonth < product.minAgeMonth || ageMonth > product.maxAgeMonth) return -1;

  if (form.budget === '基础预算' && product.priceMin <= 50) score += 16;
  if (form.budget === '均衡保障' && product.coverageAmount >= 15000) score += 12;
  if (form.budget === '高额保障' && product.coverageAmount >= 30000) score += 18;
  if (form.hasMedicalHistory === '是') score -= 18;
  if (ageMonth >= 84 && product.id === 'senior-pet-care') score += 28;
  if (ageMonth <= 12 && product.tags.indexOf('幼猫友好') >= 0) score += 10;

  return score;
}

function buildRecommendation(form) {
  const matched = products
    .map((product) => ({
      product,
      score: scoreProduct(product, form),
      estimatedPrice: estimatePrice(product, form)
    }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score);

  const attention = [];
  if (form.hasMedicalHistory === '是') {
    attention.push('宠物存在既往病史，建议进入人工核保或咨询顾问后再投保。');
  }
  if (!matched.length) {
    attention.push('当前信息没有匹配到可直接推荐的产品，请提交联系方式由顾问协助确认。');
  }

  return {
    items: matched,
    attention
  };
}

module.exports = {
  buildRecommendation,
  getAgeMonth
};
