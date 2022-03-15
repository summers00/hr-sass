// 模块的路由规则
import Layout from "@/layout";
export default {
  path: "/permission",
  name: "permissions", //路由权限时用
  component: Layout,
  children: [
    {
      //二级路由
      path: "", //空表示该路由为默认显示的二级路由
      component: () => import("@/views/permission"), //按需加载
      meta: {
        //路由元数据，存数据的对象
        title: "权限管理", //左侧导航会读取的内容
        icon: "lock",
      },
    },
  ],
};
