import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'


// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login'),
      meta: {auth: false}
    },
    // {
    //   path: "",
    //   redirect: "/commodityManagement/commodity",
    //   meta: {auth: true}
    // },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
      meta: {auth: false}
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
      meta: {auth: false}
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/commodityManagement/commodity',
      children: [
        // {
        //   path: 'dashboard',
        //   name: 'Dashboard',
        //   meta: {
        //     icon: 'dashboard',auth: true
        //   },
        //   component: BlankView,
        //   children: [
        //     {
        //       path: 'workplace',
        //       name: '工作台',
        //       meta: {
        //         page: {
        //           closable: false
        //         },
        //         auth: true
        //       },
        //       component: () => import('@/pages/dashboard/workplace'),
        //     },
        //     {
        //       path: 'analysis',
        //       name: '分析页',
        //       component: () => import('@/pages/dashboard/analysis'),
        //       meta:{auth:true}
        //     }
        //   ]
        // },
        // {
        //   path: 'form',
        //   name: '表单页',
        //   meta: {
        //     icon: 'form',
        //     page: {
        //       cacheAble: false
        //     },
        //     auth: true
        //   },
        //   component: PageView,
        //   children: [
        //     {
        //       path: 'basic',
        //       name: '基础表单',
        //       component: () => import('@/pages/form/basic'),
        //       meta:{auth: true}
        //     },
        //     {
        //       path: 'step',
        //       name: '分步表单',
        //       component: () => import('@/pages/form/step'),
        //       meta:{auth: true}
        //     },
        //     {
        //       path: 'advance',
        //       name: '高级表单',
        //       component: () => import('@/pages/form/advance'),
        //       meta:{auth: true}
        //     }
        //   ]
        // },
        {
          path:'user',
          name:'人员信息管理',
          meta:{icon:'user',auth: true},
          component: BlankView,
          children:[
            {
              path: 'admin',
              name: '管理员管理',
              component: () => import('@/views/userManagement/AdministratorManagement'),
              meta:{auth: true}
            },
            {
              path:'employee',
              name:'员工管理',
              component: ()=> import('@/views/userManagement/EmployeeManagement'),
              meta:{auth: true}
            }
          ]
        },
        {
          path:'companyManagement',
          name:'公司信息管理',
          meta:{icon:'alibaba',auth: true},
          component: BlankView,
          children:[
            {
              path: 'company',
              name: '公司管理',
              component: () => import('@/views/companyMangement/Company'),
              meta:{auth: true}
            },
          ]
        },
        {
          path:'commodityManagement',
          name:'商品信息管理',
          meta:{icon:'codepen',auth: true},
          component: BlankView,
          children:[
            {
              path: 'commodity',
              name: '商品管理',
              component: () => import('@/views/commodityManagement/Commodity '),
              meta:{auth: true}
            },
          ]
        },
        {
          path:'warehouseManagement',
          name:'仓库信息管理',
          meta:{icon:'bank',auth: true},
          component: BlankView,
          children:[
            {
              path: 'warehouse',
              name: '仓库管理',
              component: () => import('@/views/warehouseManagement/Warehouse'),
              meta:{auth: true}
            },
            {
              path: 'details/:id',
              component: () => import('@/views/warehouseManagement/Details'),
              name: '仓库详情',
              meta: {auth: true,invisible:true}
            },
          ]
        },
        {
          path:'transportManagement',
          name:'运输信息管理',
          meta:{icon:'car',auth: true},
          component: BlankView,
          children:[
            {
              path: 'vehicle',
              name: '车辆资料',
              component: () => import('@/views/transportManagement/Vehicle'),
              meta:{auth: true}
            },
          ]
        },
        {
          path:'saleManagement',
          name:'销售信息管理',
          meta:{icon:'dollar',auth: true},
          component: BlankView,
          children:[
            {
              path: 'sale/create',
              name: '销售开票',
              component: () => import('@/views/saleManagement/Create'),
              meta:{auth: true}
            },
            {
              path: 'sale/list',
              name: '销售记录',
              component: () => import('@/views/saleManagement/List'),
              meta:{auth: true}
            },
          ]
        },
        {
          path:'distributionManagement',
          name:'配送信息管理',
          meta:{icon:'rocket',auth: true},
          component: BlankView,
          children:[
            {
              path: 'create',
              name: '申请配送',
              component: () => import('@/views/distributionManagement/Create'),
              meta:{auth: true}
            },
            {
              path: 'list',
              name: '配送列表',
              component: () => import('@/views/distributionManagement/List'),
              meta:{auth: true}
            },
          ]
        },
        {
          path:'statisticalManagemant',
          name:'统计分析管理',
          meta:{icon:'pie-chart',auth: true},
          component: BlankView,
          children:[
            {
              path: 'in',
              name: '入库分析',
              component: () => import('@/views/statisticalManagemant/In'),
              meta:{auth: true}
            },
            {
              path: 'out',
              name: '出库分析',
              component: () => import('@/views/statisticalManagemant/Out'),
              meta:{auth: true}
            },
          ]
        },
        {
          path:'locationManagement',
          name:'定位信息管理',
          meta:{icon:'compass',auth: true},
          component: BlankView,
          children:[
            {
              path: 'location',
              name: '位置输入',
              component: () => import('@/views/locationManagement/Location'),
              meta:{auth: true}
            },
          ]
        },
        {
          path:'systemManagement',
          name:'系统信息管理',
          meta:{icon:'tool',auth: true},
          component: BlankView,
          children:[
            {
              path: 'role',
              name: '权限列表',
              component: () => import('@/views/systemManagement/Role'),
              meta:{auth: true}
            },
            {
              path: 'pwd',
              name: '密码修改',
              component: () => import('@/views/systemManagement/UpdatePwd'),
              meta:{auth: true,invisible:true}
            },
          ]
        },
        // {
        //   path: 'list',
        //   name: '列表页',
        //   meta: {
        //     icon: 'table'
        //   },
        //   component: PageView,
        //   children: [
        //     {
        //       path: 'query',
        //       name: '查询表格',
        //       meta: {
        //         authority: 'queryForm',auth: true
        //       },
        //       component: () => import('@/pages/list/QueryList'),
        //     },
        //     {
        //       path: 'query/detail/:id',
        //       name: '查询详情',
        //       meta: {
        //         highlight: '/list/query',
        //         invisible: true,
        //         auth: true
        //       },
        //       component: () => import('@/pages/Demo'),
        //     },
        //     {
        //       path: 'primary',
        //       name: '标准列表',
        //       component: () => import('@/pages/list/StandardList'),
              
        //     },
        //     {
        //       path: 'card',
        //       name: '卡片列表',
        //       component: () => import('@/pages/list/CardList'),
        //     },
        //     {
        //       path: 'search',
        //       name: '搜索列表',
        //       component: () => import('@/pages/list/search/SearchLayout'),
        //       children: [
        //         {
        //           path: 'article',
        //           name: '文章',
        //           component: () => import('@/pages/list/search/ArticleList'),
        //         },
        //         {
        //           path: 'application',
        //           name: '应用',
        //           component: () => import('@/pages/list/search/ApplicationList'),
        //         },
        //         {
        //           path: 'project',
        //           name: '项目',
        //           component: () => import('@/pages/list/search/ProjectList'),
        //         }
        //       ]
        //     }
        //   ]
        // },
        // {
        //   path: 'details',
        //   name: '详情页',
        //   meta: {
        //     icon: 'profile'
        //   },
        //   component: BlankView,
        //   children: [
        //     {
        //       path: 'basic',
        //       name: '基础详情页',
        //       component: () => import('@/pages/detail/BasicDetail')
        //     },
        //     {
        //       path: 'advance',
        //       name: '高级详情页',
        //       component: () => import('@/pages/detail/AdvancedDetail')
        //     }
        //   ]
        // },
        // {
        //   path: 'result',
        //   name: '结果页',
        //   meta: {
        //     icon: 'check-circle-o',
        //   },
        //   component: PageView,
        //   children: [
        //     {
        //       path: 'success',
        //       name: '成功',
        //       component: () => import('@/pages/result/Success')
        //     },
        //     {
        //       path: 'error',
        //       name: '失败',
        //       component: () => import('@/pages/result/Error')
        //     }
        //   ]
        // },
        {
          path: 'exception',
          name: '异常页',
          meta: {
            icon: 'warning',
            invisible:true,
          },
          component: BlankView,
          children: [
            {
              path: '404',
              name: 'Exp404',
              meta:{auth: true},
              component: () => import('@/pages/exception/404')
            },
            {
              path: '403',
              name: 'Exp403',
              meta:{auth: true},
              component: () => import('@/pages/exception/403')
            },
            {
              path: '500',
              name: 'Exp500',
              meta:{auth: true},
              component: () => import('@/pages/exception/500')
            }
          ]
        },
        // {
        //   path: 'components',
        //   name: '内置组件',
        //   meta: {
        //     icon: 'appstore-o'
        //   },
        //   component: PageView,
        //   children: [
        //     {
        //       path: 'taskCard',
        //       name: '任务卡片',
        //       component: () => import('@/pages/components/TaskCard')
        //     },
        //     {
        //       path: 'palette',
        //       name: '颜色复选框',
        //       component: () => import('@/pages/components/Palette')
        //     },
        //     {
        //       path: 'table',
        //       name: '高级表格',
        //       component: () => import('@/pages/components/table')
        //     }
        //   ]
        // },
        // {
        //   name: '验权表单',
        //   path: 'auth/form',
        //   meta: {
        //     icon: 'file-excel',
        //     authority: {
        //       permission: 'form'
        //     }
        //   },
        //   component: () => import('@/pages/form/basic')
        // },
        // {
        //   name: '带参菜单',
        //   path: 'router/query',
        //   meta: {
        //     icon: 'project',
        //     query: {
        //       name: '菜单默认参数'
        //     }
        //   },
        //   component: () => import('@/pages/Demo')
        // },
        // {
        //   name: '动态路由菜单',
        //   path: 'router/dynamic/:id',
        //   meta: {
        //     icon: 'project',
        //     params: {
        //       id: 123
        //     }
        //   },
        //   component: () => import('@/pages/Demo')
        // },
        // {
        //   name: 'Ant Design Vue',
        //   path: 'antdv',
        //   meta: {
        //     icon: 'ant-design',
        //     link: 'https://www.antdv.com/docs/vue/introduce-cn/'
        //   }
        // },
        // {
        //   name: '使用文档',
        //   path: 'document',
        //   meta: {
        //     icon: 'file-word',
        //     link: 'https://iczer.gitee.io/vue-antd-admin-docs/'
        //   }
        // }
      ]
    },
  ]
}

export default options
