<template>
  <upload-excel :onSuccess="success" />
</template>

<script>
import { importEmplyee } from "@/api/employees";
export default {
  methods: {
    // results表格中的数据(数组)
    async success({ header, results }) {
      // 表格中标题对应员工表单数据字段名
      const userRelations = {
        入职日期: "timeOfEntry",
        手机号: "mobile",
        姓名: "username",
        转正日期: "correctionTime",
        工号: "workNumber",
      };
      // // 结果数组
      // let arr = [];
      // // 遍历结果数组
      // results.forEach((item) => {
      //   const userInfo = {};
      //   //item取到每个对象
      //   // 对象中key放一个数组内
      //   Object.keys(item).forEach((key) => {
      //     //取到数组中每个key，中文
      //     // 将结果的值给userInfo对应的值
      //     userInfo[userRelations[key]] = item[key];
      //   });
      //   // 遍历的对象保存到数组
      //   arr.push(userInfo);
      // });
      // console.log(arr);

      let arr = results.map((item) => {
        //item取到数组中每个对象，key为中文
        const userInfo = {}; //接收每个对象
        // 对象中key转为数组
        Object.keys(item).forEach((key) => {
          // 如字段名为入职时间和转正时间，则格式化日期
          if (
            userRelations[key] === "timeOfEntry" ||
            userRelations[key] === "correctionTime"
          ) {
            // 把对应值格式化，必须是日期格式，所以new Date才能存到数据库
            userInfo[userRelations[key]] = new Date(
              this.formatDate(item[key], "/")
            );
          } else {
            // userRelations[key]是值==> mobile
            // userInfo.mobile = 表格中的手机号(值)
            userInfo[userRelations[key]] = item[key];
          }
        });
        // 返回对象
        return userInfo;
      });
      // 调导入接口，传入数组
      await importEmplyee(arr);
      this.$message.success("导入成功");
      // 回到上一页
      this.$router.back();
    },
    // 转换日期
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return (
        year +
        (month < 10 ? "0" + month : month) +
        (date < 10 ? "0" + date : date)
      );
    },
  },
};
</script>

<style>
</style>