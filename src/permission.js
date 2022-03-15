// 已经在main.js中引入代码，不需导出，只要执行
import router from "@/router";
// 引入store实例，和组件中this.$store一样
import store from "@/store";
// 进度条
import nprogress from "nprogress";
// 进度条样式
import "nprogress/nprogress.css";
import { setTimeStamp } from "@/utils/auth";

// 定义白名单，所有不需权限的页面
const whiteList = ["/login", "/404"];

// 路由跳转前
// next()放行
// next('地址') 跳转页面
// next(false) 跳转终止
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  nprogress.start();
  // 如果有token
  if (store.getters.token) {
    // 如果要跳转的是登录页
    if (to.path === "/login") {
      // 跳转到主页
      next("/");
    } else {
      // 有userId说明已经获取到就不用再获取，没有则重新获取
      if (!store.getters.userId) {
        // 获取action用户信息的接口,action是异步，必须await变成同步，获取完用户信息才能放行，因后面的页面要用userId
        const { roles } = await store.dispatch("user/getUserInfo");
        // 调用actions筛选路由的方法,传入权限标识数组,获取action返回的routes
        const routes = await store.dispatch(
          "permission/filterRoutes",
          roles.menus
        );
        // 将404放到所有路由后面
        router.addRoutes([
          ...routes,
          { path: "*", redirect: "/404", hidden: true },
        ]); //将拥有的路由添加到路由表
        //addRoutes必须用to.path,先跳转一次,加入到路由表,再进来就能跳转
        next(to.path);
      } else {
        // 如果不是登录页，则放行
        next();
      }
    }
    // 如果没有token
  } else {
    // 如果要跳转的是白名单页面,找不到返回-1
    if (whiteList.indexOf(to.path) !== -1) {
      // 放行
      next();
    } else {
      // 如果不是白名单页，则跳到登录页
      next("/login");
    }
  }
  // 手动关闭进度条，解决手动切换地址时，进度条不关闭的问题
  nprogress.done();
});

// 路由跳转后
router.afterEach(() => {
  // 关闭进度条
  nprogress.done();
});
