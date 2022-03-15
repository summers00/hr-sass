import Vue from "vue";
import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n
import "@/styles/index.scss"; // global css
import App from "./App";
import store from "./store";
import router from "./router";
import "@/icons"; // icon
import "@/permission"; // permission control
// 全局公共组件
import components from "@/components";
// 导入所有自定义指令为对象,{变量1:{},变量2:{}}
import * as directives from "@/directives";
// 过滤器
import * as filters from "@/filters";
import Print from "vue-print-nb";
import checkPermission from "@/mixin/checkpermission";

// es6的遍历对象,类似于for..in,取到对象的属性名放数组内['变量1','变量2']
// 将对象所有属性放数组内, 再去遍历数组
Object.keys(directives).forEach((key) => {
  //key为变量1,变量2
  // 全局注册自定义指令
  Vue.directive(key, directives[key]); //对象名[key]为属性值
});

// 全局注册过滤器
Object.keys(filters).forEach((key) => {
  // 全局注册过滤器
  Vue.filter(key, filters[key]);
});

// 全局注册element
Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 全局注册组件
Vue.use(components);
Vue.use(Print);
// 全局混入检查权限的方法
Vue.mixin(checkPermission);

Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
