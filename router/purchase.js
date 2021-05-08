//采购管理路由配置
export default [
  {
    path: '/lowAmountInstrumentList',
    name: '采购申请单列表',
    component: resolve => require(['@/yiyon/purchase/lowAmountInstrument/InstrumentList.vue'], resolve),
  },
  {
    path: '/lowAmountInstrumentAudit',
    name: '采购申请单审批',
    component: resolve => require(['@/yiyon/purchase/lowAmountInstrument/InstrumentAudit.vue'], resolve),
  },
]
