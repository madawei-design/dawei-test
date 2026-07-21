const products = [
  {
    id: 'dog-medical-flagship',
    name: '狗狗尊享医疗险',
    companyName: '安心宠保合作平台',
    petTypes: ['dog'],
    category: '医疗险',
    minAgeMonth: 2,
    maxAgeMonth: 96,
    coverageAmount: 30000,
    deductible: 200,
    waitingPeriod: 20,
    priceMin: 49,
    priceMax: 129,
    tags: ['门诊住院', '意外医疗', '幼犬可投'],
    summary: '适合 2 个月至 8 岁狗狗，覆盖常见疾病、意外就诊和住院治疗。',
    highlights: ['最高 3 万医疗保障', '覆盖门诊、住院与手术医疗', '支持常见皮肤病、肠胃炎等治疗费用报销'],
    exclusions: ['既往症', '等待期内疾病', '美容、绝育和非治疗性项目'],
    applyUrl: 'https://example.com/apply/dog-medical-flagship',
    recommendWeight: 98,
    featured: true,
    orderLabel: '立即下单'
  },
  {
    id: 'cat-care-plus',
    name: '猫咪安心医疗险',
    companyName: '示例财险',
    petTypes: ['cat'],
    category: '医疗险',
    minAgeMonth: 2,
    maxAgeMonth: 96,
    coverageAmount: 20000,
    deductible: 300,
    waitingPeriod: 30,
    priceMin: 29,
    priceMax: 88,
    tags: ['门诊可选', '住院保障', '幼猫友好'],
    summary: '适合 2 个月至 8 岁猫咪，覆盖常见疾病治疗和意外医疗。',
    highlights: ['最高 2 万医疗保障', '支持猫瘟、肠胃炎等常见疾病', '线上理赔材料提交'],
    exclusions: ['既往症', '等待期内疾病', '美容、绝育等非治疗项目'],
    applyUrl: 'https://example.com/apply/cat-care-plus',
    recommendWeight: 95
  },
  {
    id: 'dog-medical-basic',
    name: '狗狗基础医疗险',
    companyName: '示例保险',
    petTypes: ['dog'],
    category: '医疗险',
    minAgeMonth: 3,
    maxAgeMonth: 84,
    coverageAmount: 15000,
    deductible: 500,
    waitingPeriod: 30,
    priceMin: 35,
    priceMax: 99,
    tags: ['性价比', '意外疾病', '中小型犬'],
    summary: '覆盖狗狗疾病和意外医疗，适合预算敏感的新手宠物主。',
    highlights: ['疾病和意外医疗均覆盖', '免赔额清晰', '适合中小型犬日常保障'],
    exclusions: ['大型犬部分品种需核保', '遗传病', '既往症'],
    applyUrl: 'https://example.com/apply/dog-medical-basic',
    recommendWeight: 82
  },
  {
    id: 'pet-premium-all',
    name: '宠物高额综合保障',
    companyName: '示例联合保险',
    petTypes: ['cat', 'dog'],
    category: '综合险',
    minAgeMonth: 2,
    maxAgeMonth: 120,
    coverageAmount: 50000,
    deductible: 200,
    waitingPeriod: 20,
    priceMin: 89,
    priceMax: 199,
    tags: ['高保额', '低免赔', '猫狗可投'],
    summary: '面向希望获得更高保障额度的宠物家庭，兼顾疾病、意外和第三方责任。',
    highlights: ['最高 5 万医疗保障', '含第三方责任保障', '等待期较短'],
    exclusions: ['职业犬用途', '未按免疫要求接种', '投保前已确诊疾病'],
    applyUrl: 'https://example.com/apply/pet-premium-all',
    recommendWeight: 90
  },
  {
    id: 'senior-pet-care',
    name: '高龄宠物守护计划',
    companyName: '示例健康险',
    petTypes: ['cat', 'dog'],
    category: '医疗险',
    minAgeMonth: 84,
    maxAgeMonth: 144,
    coverageAmount: 12000,
    deductible: 800,
    waitingPeriod: 45,
    priceMin: 79,
    priceMax: 169,
    tags: ['高龄可投', '人工核保', '慢病咨询'],
    summary: '适合 7 岁以上猫狗，提供有限医疗保障和健康咨询服务。',
    highlights: ['最高 12 岁可投', '含在线健康咨询', '适合高龄宠物基础保障'],
    exclusions: ['严重既往症', '等待期内疾病', '牙科美容项目'],
    applyUrl: 'https://example.com/apply/senior-pet-care',
    recommendWeight: 75
  }
];

const petTypeOptions = [
  { label: '猫', value: 'cat' },
  { label: '狗', value: 'dog' }
];

const cityOptions = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '其他'];

module.exports = {
  products,
  petTypeOptions,
  cityOptions
};
