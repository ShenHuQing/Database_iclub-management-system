import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: '/profile',
          name: '个人中心',
          component: () => import('../pages/profile/Profile'),
          meta: {
            invisible: true,
            page: {
              cacheAble: true
            }
          }
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
              path: 'workplace',
              name: '主页',
              meta: {
                page: {
                  closable: false
                }
              },
              component: () => import('@/pages/dashboard/workplace'),
            },
            // {
            //   path: 'analysis',
            //   name: '分析页',
            //   component: () => import('@/pages/dashboard/analysis'),
            // }
          ]
        },
        {
          path: 'information',
          name: '社团',
          meta: {
            icon: 'appstore-o',
            page: {
              cacheAble: false
            }
          },
          component: PageView,
          children: [
            {
              path: 'clubs',
              name: '社团页',
              component: () => import('@/pages/clubs'),
            },
            {
              path: 'myjoinclubs',
              name: '已加入',
              component: () => import('@/pages/myjoinclubs'),
            },
            {
              path: 'myfollowclubs',
              name: '已关注',
              component: () => import('@/pages/myfollowclubs'),
            },
            {
              path: 'myhandleclubs',
              name: '已管理',
              component: () => import('@/pages/myhandleclubs'),
            }
          ]
        },
        {
          path: '/clubdetail/:id',
          name: '社团信息',
          component: () => import('@/pages/clubdetail/Clubdetail'),
          meta: {
            invisible: true, // 添加此属性
            page: {
              cacheAble: true
            }
          }
        },
        {
          path: '/activitydetail',
          name: '活动详情',
          component: () => import('@/pages/activitydetail/Activitydetail'),
          meta: {
            invisible: true, // 添加此属性
            page: {
              cacheAble: true
            }
          }
        },
        {
          path: '/enroll',
          name: '报名表单',
          component: () => import('@/pages/enroll/Enroll'),
          meta: {
            invisible: true, // 添加此属性
            page: {
              cacheAble: true
            }
          }
        },
        {
          path: 'form',
          name: '表单',
          meta: {
            icon: 'form',
            page: {
              cacheAble: false
            }
          },
          component: PageView,
          children: [
            {
              path: 'apply',
              name: '活动申请',
              component: () => import('@/pages/apply/Apply'),
            },
            {
              path: 'announcement',
              name: '发布公告',
              component: () => import('@/pages/announcement/Announcement'),
            }
          ]
        },
        {
          path: 'list',
          name: '列表',
          meta: {
            icon: 'table'
          },
          component: PageView,
          children: [
            {
              path: 'approval',
              name: '审批列表',
              component: () => import('@/pages/approval/Approval'),
            },
            {
              path: 'myenroll',
              name: '我的报名',
              component: () => import('@/pages/myenroll/MyEnroll'),
            },
            {
              path: 'myapply',
              name: '我的申请',
              component: () => import('@/pages/myapply/MyApply'),
            },
            // {
            //   path: 'query',
            //   name: '查询表格',
            //   meta: {
            //     authority: 'queryForm',
            //   },
            //   component: () => import('@/pages/list/QueryList'),
            // },
            // {
            //   path: 'query/detail/:id',
            //   name: '查询详情',
            //   meta: {
            //     highlight: '/list/query',
            //     invisible: true
            //   },
            //   component: () => import('@/pages/Demo')
            // },
            // {
            //   path: 'primary',
            //   name: '标准列表',
            //   component: () => import('@/pages/list/StandardList'),
            // },
            // {
            //   path: 'card',
            //   name: '卡片列表',
            //   component: () => import('@/pages/list/CardList'),
            // },
            // {
            //   path: 'search',
            //   name: '搜索列表',
            //   component: () => import('@/pages/list/search/SearchLayout'),
            //   children: [
            //     {
            //       path: 'article',
            //       name: '文章',
            //       component: () => import('@/pages/list/search/ArticleList'),
            //     },
            //     {
            //       path: 'application',
            //       name: '应用',
            //       component: () => import('@/pages/list/search/ApplicationList'),
            //     },
            //     {
            //       path: 'project',
            //       name: '项目',
            //       component: () => import('@/pages/list/search/ProjectList'),
            //     }
            //   ]
            // }
          ]
        },
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
        // {
        //   path: 'exception',
        //   name: '异常页',
        //   meta: {
        //     icon: 'warning',
        //   },
        //   component: BlankView,
        //   children: [
        //     {
        //       path: '404',
        //       name: 'Exp404',
        //       component: () => import('@/pages/exception/404')
        //     },
        //     {
        //       path: '403',
        //       name: 'Exp403',
        //       component: () => import('@/pages/exception/403')
        //     },
        //     {
        //       path: '500',
        //       name: 'Exp500',
        //       component: () => import('@/pages/exception/500')
        //     }
        //   ]
        // },
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
