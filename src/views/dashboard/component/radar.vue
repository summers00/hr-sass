<template>
  <div ref="mydiv" class="radar-echart"></div>
</template>

<script>
var echarts = require("echarts/lib/echarts"); // 引入echarts主模块
require("echarts/lib/chart/radar"); // 引入雷达图
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  //数据渲染完
  mounted() {
    // 创建实例
    const myChart = echarts.init(this.$refs.mydiv);
    myChart.setOption({
      title: {
        text: "基础雷达图",
      },
      legend: {
        data: ["Allocated Budget", "Actual Spending"],
      },
      radar: {
        // 每个区域的最高值,
        indicator: [
          { name: "工作效率", max: 100 },
          { name: "考勤", max: 100 },
          { name: "积极性", max: 100 },
          { name: "帮助同事", max: 100 },
          { name: "自主学习", max: 100 },
          { name: "正确率", max: 100 },
        ],
      },
      series: [
        {
          name: "Budget vs spending",
          type: "radar",
          data: [
            {
              value: [10, 1, 100, 5, 100, 0],
              name: "张三",
            },
            {
              value: [50, 50, 50, 50, 50, 10],
              name: "李四",
            },
          ],
        },
      ],
    });
  },
};
</script>

<style>
.radar-echart {
  width: 600px;
  height: 400px;
}
</style>
