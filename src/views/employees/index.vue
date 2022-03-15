<template>
  <div class="employees-container">
    <!-- 头部 -->
    <page-tools :showLeft="true">
      <!-- 替换插槽 -->
      <span slot="left">共{{ page.total }}条记录</span>
      <template v-slot:right>
        <!-- 点导入跳转导入路由页面 -->
        <el-button type="warning" size="small" @click="$router.push('/import')"
          >导入</el-button
        >
        <el-button type="danger" size="small" @click="exportData"
          >导出</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="showDialog = true"
          v-if="checkPermission('POINT-USER-ADD')"
          >新增员工</el-button
        >
      </template>
    </page-tools>
    <!-- 内容 -->
    <el-card v-loading="loading">
      <!-- 表格 -->
      <el-table border :data="list">
        <el-table-column label="序号" type="index" sortable></el-table-column>
        <el-table-column
          label="姓名"
          prop="username"
          sortable
        ></el-table-column>
        <el-table-column label="头像" align="center">
          <template slot-scope="{ row }">
            <img
              v-imgerror="require('@/assets/common/bigUserHeader.png')"
              slot="reference"
              :src="row.staffPhoto"
              style="border-radius: 50%; width: 100px; height: 100px"
              @click="showQrCode(row.staffPhoto)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="工号"
          prop="workNumber"
          sortable
        ></el-table-column>
        <!-- 绑定列的格式化内容属性 -->
        <el-table-column
          :formatter="formatEmployment"
          label="聘用形式"
          prop="formOfEmployment"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="部门"
          prop="departmentName"
          sortable
        ></el-table-column>
        <el-table-column label="入职时间" prop="timeOfEntry" sortable>
          <!-- 作用域插槽(接收列数据对象形式)+过滤器(方法名) -->
          <template slot-scope="{ row }">{{
            row.timeOfEntry | formatDate
          }}</template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState" sortable>
          <template slot-scope="{ row }">
            <!-- 账户状态为1时打开 -->
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button
            >
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)"
              >角色</el-button
            >
            <el-button type="text" size="small" @click="delEmployee(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          layout="prev,pager,next"
          @current-change="changePage"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <!-- 新增弹层 -->
    <add-employee :showDialog.sync="showDialog"></add-employee>
    <!-- sync监听子组件改变父组件数据的语法糖 -->

    <!-- 二维码弹层 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>

    <!-- 角色弹层 -->
    <assign-role
      :showRoleDialog.sync="showRoleDialog"
      :userId="userId"
      ref="assignRole"
    ></assign-role>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees";
import EmployeeEnum from "@/api/constant/employees";
import AddEmployee from "./component/AddEmployee";
import AssignRole from "./component/AssignRole";
import { formatDate } from "@/filters";
import Qrcode from "qrcode";
export default {
  components: { AddEmployee, AssignRole },
  data() {
    return {
      list: [], //接收员工列表
      page: {
        //页码信息，对应接口名
        page: 1, //当前页
        size: 10, //每页条数
        total: 0, //总数
      },
      loading: false, //显示加载
      showDialog: false, //是否显示弹层
      showCodeDialog: false, //是否显示二维码弹层
      showRoleDialog: false, //是否显示角色弹层
      userId: null, //用户id
    };
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    // 获取员工列表的方法
    async getEmployeeList() {
      this.loading = true;
      // 获取员工列表
      const { total, rows } = await getEmployeeList(this.page);
      this.page.total = total;
      this.list = rows;
      this.loading = false;
    },
    // 切换分页
    changePage(newPage) {
      // 保存最新的当前页码
      this.page.page = newPage;
      // 重新获取数据
      this.getEmployeeList();
    },
    // 点击删除员工
    async delEmployee(id) {
      // 是否确认删除
      try {
        await this.$confirm("是否确认删除？");
        // await下面是点确认删除后的，try..catch捕获点取消后的
        // 确认后调删除接口
        await delEmployee(id);
        // 重获数据
        this.getEmployeeList();
        // 提示成功
        this.$message.success("删除成功");
      } catch (error) {
        //不处理错误会报错
        console.log(error);
      }
    },
    // 格式化聘用形式 1.列数据 2.行数据 3.单元格数据 4.索引
    formatEmployment(row, column, cellValue, index) {
      // 聘用形式数组中找和单元格对应的项
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      // 如obj为1返回对应值，否则未知
      return obj ? obj.value : "未知";
    },
    // 点击导出
    exportData() {
      // 中文-表格的格式，英文-数据中存储的格式
      const header = {
        //导出表格的顺序
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      // 点击时导入文件(懒加载)导入成功后进入then
      import("@/vendor/Export2Excel").then(async (excel) => {
        // 调获取员工信息的接口,1页显示所有数据,解构所有数据
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        });
        const data = this.formatJson(header, rows);
        const multiHead = [["姓名", "主要信息", "", "", "", "", "部门"]]; //一个数组对应一行表头，单元格没有内容写空
        const merges = ["A1:A2", "B1:F1", "G1:G2"];
        //excel是引入文件所导出的对象，直接调里面的方法
        excel.export_json_to_excel({
          // 将所有key放在一个数组内['手机号'..]
          header: Object.keys(header),
          // 一条数据对应一个数组
          data,
          filename: "员工信息表",
          multiHead, //复杂表头
          merges, //单元格合并
        });
      });
    },
    // 将[{}]转为[[]]
    formatJson(header, rows) {
      //rows为数组
      console.log(rows);
      //item为对象
      return rows.map((item) => {
        //返回[[138]]
        // ['手机号'..],key为'手机号'
        return Object.keys(header).map((key) => {
          // 返回['138']
          // 如是日期则格式化
          if (
            header[key] === "timeOfEntry" ||
            header[key] === "correctionTime"
          ) {
            return formatDate(item[header[key]]);
            // 如是聘用形式
          } else if (header[key] === "formOfEmployment") {
            // 如形式id为1返回value，否则未知
            // 从枚举数组找出和结果id对应的item
            const obj = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[header[key]]
            ); //find中不能是item，会用上面的item
            return obj ? obj.value : "未知";
          }
          return item[header[key]]; //item[mobile] ==> 138值
        });
      });
    },
    // 点击头像显示二维码
    showQrCode(url) {
      if (url) {
        //如果有头像地址再显示弹层
        this.showCodeDialog = true; //页面渲染是异步的,不能马上打开弹层,获取弹层中的canvas获取不到
        // 上一次数据更新完后调用,页面渲染完,这里已经打开弹层,所以能获取到
        this.$nextTick(() => {
          //1.canvas-dom 2.转换的地址/内容,地址跳转,内容显示
          Qrcode.toCanvas(this.$refs.myCanvas, url);
        });
      } else {
        //没有头像不打开弹层
        this.$message.warning("该用户未上传头像");
      }
    },
    // 点击角色
    async editRole(id) {
      // 保存当前点击的用户id
      this.userId = id;
      // 获取当前用户的角色id(调子组件的方法)
      await this.$refs.assignRole.getUserDetailById(id); //异步方法,避免打开弹层闪一下,await获取到结果后再打开弹层
      // 显示弹层
      this.showRoleDialog = true;
    },
  },
};
</script>

<style></style>
