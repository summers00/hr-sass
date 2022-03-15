<template>
  <div>
    <el-row type="flex" justify="end">
      <!-- v-model绑定当前显示的值 -->
      <el-select
        v-model="currentYear"
        @change="dateChange"
        size="small"
        style="width: 120px"
      >
        <el-option v-for="item in yearList" :key="item" :value="item">{{
          item
        }}</el-option>
      </el-select>
      <el-select
        v-model="currentMonth"
        @change="dateChange"
        size="small"
        style="width: 120px; margin-left: 10px"
      >
        <el-option v-for="item in 12" :key="item" :value="item">{{
          item
        }}</el-option>
      </el-select>
    </el-row>
    <!-- 日历,v-model绑定当前日期 -->
    <el-calendar v-model="currentDate">
      <!-- 自定义内容,date当前单元格日期 -->
      <template v-slot:dateCell="{ date, data }">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  props: {
    startDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  data() {
    return {
      yearList: [], //所有年份的列表
      currentYear: null, //当前年份
      currentMonth: null, //当前月份
      currentDate: null, //当前日期
    };
  },
  created() {
    // 获取传入日期的月份
    this.currentMonth = this.startDate.getMonth() + 1;
    // 获取传入日期的年份（当前年）
    this.currentYear = this.startDate.getFullYear();
    // 获取传入日期的年份（前5年、当前年、后5年）
    this.yearList = Array.from(
      Array(11),
      (value, index) => index + this.currentYear - 5
    );
    this.dateChange(); //手动初始当前日期
  },
  methods: {
    // 下拉列表值改变时触发
    dateChange() {
      // 生成最新当前日期,当前年月的1日为起始日期
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`);
    },
    // 是否是周末
    isWeek(value) {
      return value.getDay() === 0 || value.getDay() === 6;
    },
  },
  filters: {
    // 获取日期
    getDay(value) {
      // 字符转为数组
      const day = value.split("-")[2];
      // 以0开头截取第一位
      return day.startsWith("0") ? day.substr(1) : day;
    },
  },
};
</script>
<style scoped>
/deep/ .el-calendar-day {
  height: auto;
}
/deep/ .el-calendar-table__row td,
/deep/ .el-calendar-table tr td:first-child,
/deep/ .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
/* /deep/ .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
} */
/deep/ .el-calendar__header {
  display: none;
}
</style>
