<template>
  <el-row
    type="flex"
    justify="space-between"
    style="width: 100%; height: 40px"
    align="middle"
  >
    <!-- 左侧 -->
    <el-col>
      <span>{{ data.name }}</span>
    </el-col>
    <!-- 右侧 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 负责人 -->
        <el-col>{{ data.manager }}</el-col>
        <!-- 操作 -->
        <el-col>
          <el-dropdown @command="handleCommand">
            <span>操作<i class="el-icon-arrow-down" /></span>
            <el-dropdown-menu>
              <!-- 如没有添加部门的操作权限则隐藏按钮 -->
              <el-dropdown-item
                command="add"
                v-if="!checkPermission('add-depts')"
                >添加子部门</el-dropdown-item
              >
              <!-- 如是根节点则不显示 -->
              <el-dropdown-item v-if="!isRoot" command="edit"
                >编辑子部门</el-dropdown-item
              >
              <el-dropdown-item v-if="!isRoot" command="del"
                >删除子部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from "@/api/departments";
export default {
  props: {
    // 传入节点数据
    data: {
      require: true,
      type: Object,
    },
    // 是否是根节点
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 接收item绑定command值
    handleCommand(type) {
      if (type === "add") {
        //添加操作,将当前点击的节点数据传出(要确定添加到哪个部门下)
        this.$emit("addDepts", this.data);
      } else if (type === "edit") {
        //编辑操作,需要当前节点数据(确定点击哪个就编辑哪个)
        this.$emit("editDepts", this.data);
      } else if (type === "del") {
        //提示是否删除,element组件,确认进入then,取消进入catch
        this.$confirm("确定要删除该部门吗").then(() => {
          // 传入部门id
          return delDepartments(this.data.id).then(() => {
            //return Promise对象.then获取成功后的结果
            //删除成功执行，不需.catch因request已对失败处理
            // 调接口只是服务器数据删除，前端数据没变，需重新获取，子组件没全部部门的数据，通知父组件重新获取所有部门数据
            this.$emit("delDepts");
            // 提示删除成功
            this.$message.success("删除部门成功");
          });
        });
      }
    },
  },
};
</script>

<style></style>
