// 模块的路由规则
import Layout from '@/layout'
export default {
  path: '/departments',
  name: 'departments', //路由权限时用
  component: Layout,
  children: [{ //二级路由
    path: '', //空表示该路由为默认显示的二级路由
    component: () => import('@/views/departments'), //按需加载
    meta: { //路由元数据，存数据的对象
      title: '组织架构', //左侧导航会读取的内容
      icon: 'tree'
    }
  }],

}