# 宠物保险推广小程序 MVP

这是一个可用作微信小程序起点的宠物保险推广 MVP，覆盖产品推广、保费测算、方案推荐、线索收集和渠道追踪。

## 功能范围

- 首页推广入口与活动信息
- 宠物保险产品列表
- 产品详情与保障说明
- 保费测算表单
- 本地规则推荐保险方案
- 线索本地保存
- 渠道 scene 参数追踪
- 我的页面查看最近测算与线索记录

## 目录结构

```text
pet-insurance-miniapp/
  app.js
  app.json
  app.wxss
  project.config.json
  pages/
    home/
    products/
    product-detail/
    quote/
    result/
    profile/
  utils/
    data.js
    recommendation.js
    tracking.js
```

## 运行方式

1. 打开微信开发者工具。
2. 导入 `pet-insurance-miniapp` 目录。
3. 使用测试 AppID 或正式小程序 AppID。
4. 编译运行。

## 后续接入点

- 将 `utils/data.js` 的产品静态数据替换为后端接口。
- 将 `utils/recommendation.js` 替换为保险公司实时报价接口或后端推荐服务。
- 将 `pages/result/result.js` 中的 `saveLead` 替换为后端线索提交接口。
- 在 `pages/home/home.js` 的 `onLoad` 中保留 `scene` 解析，用于渠道二维码追踪。
