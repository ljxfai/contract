import Vue from 'vue'
import Router from 'vue-router'
import finance from './finance'//财务管理
import asset from './asset'//资产管理
import purchase from './purchase' //采购管理


Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/login',
      component: resolve => require(['@/components/Login.vue'], resolve),
      name: '登录',
    },
    {
      path: '/',
      component: resolve => require(['@/components/Home.vue'], resolve),
      children: [{
          path: '/',
          name: '首页',
          component: resolve => require(['@/yiyon/index.vue'], resolve),
        }, {
          path: '/loading',
          name: '加载动画',
          component: resolve => require(['@/components/Loading.vue'], resolve),
        }, {
          path: '/list-test',
          name: '列表页',
          component: resolve => require(['@/components/list-test.vue'], resolve),
        },{
          path: '/cankao',
          name: '列表页',
          component: resolve => require(['@/yiyon/cankao/list.vue'], resolve),
        },{
        path: '/contractIncomeList',
        name: '收款合同列表',
        component: resolve => require(['@/yiyon/finance/credit/contractIncomeList.vue'], resolve),
      },
        ...finance,
        ...asset,
        ...purchase,
      ]
    },


  ]
})

//路由守卫，
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
    if (to.meta.title) {
      // document.title = to.meta.title
      window.document.title='易用联友测试环境'
    }
  //刷新的时候直接进主页面
  if (from.name === null && from.path === '/' && to.path !== '/' && to.path !== '/login' && to.path !== '/projectPaymentApplicationPrint' && to.path !== '/projectApprovalPrint' && to.path !== '/assetsDisposal' && to.path !== '/assetsInventoryJH' && to.path !== '/contractApply') {
    next('/');
  }

  //除登录页面验证一下有没有token
  if (to.path !== '/login') {
    if (localStorage.token) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
})

export default router
