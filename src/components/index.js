// 组件的全局注册
import PageTools from "./PageTools";
import UploadExcel from "./UploadExcel";
import ImgUpload from "./ImgUpload";
export default {
  install(Vue) {
    //获取vue全局对象
    // 全局注册组件 组件名 要注册的组件
    Vue.component("PageTools", PageTools);
    Vue.component("UploadExcel", UploadExcel);
    Vue.component("ImgUpload", ImgUpload);
  },
};

// Vue.use({
//   install(vue) {}
// })
