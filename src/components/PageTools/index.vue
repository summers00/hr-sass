// 通用工具栏组件
<template>
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <!-- 左侧 -->
      <el-col>
        <!-- 为了写样式，插槽外层包裹div -->
        <div v-if="showLeft" class="left">
          <i class="el-icon-info"></i>
          <!-- 定义插槽 -->
          <slot name="left" />
        </div>
      </el-col>
      <!-- 右侧 -->
      <el-col>
        <el-row type="flex" justify="end">
          <!-- 定义插槽 -->
          <slot name="right" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  props: {
    //是否显示左侧插槽
    showLeft: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang='scss'>
.page-tools {
  margin: 10px 0;
  // 左侧内容
  .left {
    // 图标
    i {
      margin-right: 5px;
      color: #409eff;
    }
    line-height: 34px;
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
}
</style>
