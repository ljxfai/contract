//财务管理路由配置
export default [
  {
    path: '/financeCredit',
    name: '授信业务单据列表',
    component: resolve => require(['@/yiyon/finance/credit/financeCreditList.vue'], resolve),
  },
  {
    path: '/financeCreditAudit',
    name: '授信业务单据审批',
    component: resolve => require(['@/yiyon/finance/credit/financeCreditAudit.vue'], resolve),
  },
  {
    path: '/financeDataList',
    name: '资料借阅申请列表',
    component: resolve => require(['@/yiyon/finance/data/financeDataList.vue'], resolve),
  },
  {
    path: '/financeDataAudit',
    name: '资料借阅申请审批',
    component: resolve => require(['@/yiyon/finance/data/financeDataAudit.vue'], resolve),
  },
  {
    path: '/financeFundList',
    name: '配套资金申请列表',
    component: resolve => require(['@/yiyon/finance/fund/financeFundList.vue'], resolve),
  },
  {
    path: '/financeFundAudit',
    name: '配套资金申请审批',
    component: resolve => require(['@/yiyon/finance/fund/financeFundAudit.vue'], resolve),
  },
]
