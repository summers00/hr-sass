// 模块的路由规则
import Layout from "@/layout";
export default {
  path: "/employees",
  name: "employees", //路由权限时用
  component: Layout,
  children: [
    {
      //二级路由
      path: "", //空表示该路由为默认显示的二级路由
      component: () => import("@/views/employees"), //按需加载
      meta: {
        //路由元数据，存数据的对象
        title: "员工", //左侧导航会读取的内容
        icon: "people",
      },
    },
    {
      // 前面不加斜杠
      path: "detail/:id", //id后?表示id可传可不传，没有则必传
      component: () => import("@/views/employees/detail"),
      hidden: true,
      meta: {
        title: "员工详情",
      },
    },
    {
      path: "print/:id", //需传id
      component: () => import("@/views/employees/print"),
      hidden: true,
      meta: {
        title: "打印",
      },
    },
  ],
};
