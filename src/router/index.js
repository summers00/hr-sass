import Vue from "vue";
import Router from "vue-router";
// 引入路由模块的规则
import departmentsRouter from "./modules/departments";
import employeesRouter from "./modules/employees";
import permissionRouter from "./modules/permission";
import settingRouter from "./modules/setting";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

// 静态路由
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "主页", icon: "dashboard" },
      },
    ],
  },
  {
    path: "/import",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/import"),
      },
    ],
    hidden: true, //不显示在左侧菜单里
  },

  // 404 page must be placed at the end !!!
];

// 动态路由
export const asyncRoutes = [

  departmentsRouter,
  employeesRouter,
  permissionRouter,

  settingRouter,
];

const createRouter = () =>
  new Router({
    //实例化路由对象
    mode: "history", // require service support
    base: "hr/", //默认前缀地址
    scrollBehavior: () => ({ y: 0 }),
    // 静态路由和动态路由临时合并
    routes: [...constantRoutes], //数组合并 添加动态路由后解除合并
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 重置路由
export function resetRouter() {
  const newRouter = createRouter();
  // 将原来的路由替换为新路由
  router.matcher = newRouter.matcher; // reset router
}

export default router;
