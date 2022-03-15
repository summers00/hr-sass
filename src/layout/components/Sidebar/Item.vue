<script>
export default {
  name: "MenuItem",
  functional: true, //表示该组件为函数式组件，没有data,this,只接收props属性
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  render(h, context) {
    //使用时传入icon title
    const { icon, title } = context.props;
    const vnodes = [];

    if (icon) {
      if (icon.includes("el-icon")) {
        vnodes.push(<i class={[icon, "sub-el-icon"]} />);
      } else {
        vnodes.push(<svg-icon icon-class={icon} />); //将所有的svg图片引入到项目
      }
    }

    if (title) {
      vnodes.push(<span slot="title">{title}</span>); //设置标题
    }
    return vnodes;
  },
};
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
