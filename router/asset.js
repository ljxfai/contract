//资产购置路由配置
export default [
  {
    path: '/assetApplyList',
    name: '资产采购申请单列表',
    component: resolve => require(['@/yiyon/asset/assetApply/list.vue'], resolve),
  },
  {
    path: '/assetApplyAudit',
    name: '资产采购申请单审批',
    component: resolve => require(['@/yiyon/asset/assetApply/audit.vue'], resolve),
  },
  {
    path: '/noAssetApplyList',
    name: '不列入固定资产采购申请单列表',
    component: resolve => require(['@/yiyon/asset/assetApply/list_no.vue'], resolve),
  },
  {
    path: '/noAssetApplyAudit',
    name: '不列入固定资产采购申请单审批',
    component: resolve => require(['@/yiyon/asset/assetApply/audit_no.vue'], resolve),
  },
  {
    path: '/assetChangeAdjustList',
    name: '资产调剂申请单列表',
    component: resolve => require(['@/yiyon/asset/assetChange/adjust/list.vue'], resolve),
  },
  {
    path: '/assetApplyAdjustAudit',
    name: '资产调剂申请单审批',
    component: resolve => require(['@/yiyon/asset/assetChange/adjust/audit.vue'], resolve),
  },
]
