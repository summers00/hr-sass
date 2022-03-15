// 所有的自定义指令
// 导出指令对象
export const imgerror = {
  // 在当前dom元素插入到节点后执行,只执行1次,参数1.要作用到的dom对象 2.指令中变量的解释
  inserted: function (dom, options) {
    // 初始化时如果src有值就用,没有就用传进来的默认值
    dom.src = dom.src || options.value;
    // 图片加载失败后触发的事件
    dom.onerror = function () {
      // 将图片地址设为传入的图片
      dom.src = options.value; //使用指令时传入的参数
    };
  },
  // 组件更新后执行,如果值在created中改变,会执行
  componentUpdated: function (dom, options) {
    dom.src = dom.src || options.value;
  },
};

// 使用自定义指令,传入参数
//   < img v-imgerror = "imageUrl" >
//   data() {
//   return {
//     imageUrl:'a.png'
//     }
// }
//   自定义指令中的options.value即imageUrl的值
