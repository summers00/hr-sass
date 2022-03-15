<template>
  <div class="departments-container">
    <el-card class="tree-card">
      <!-- 头部 -->
      <tree-tools :data="company" :isRoot="true" @addDepts="addDepts" />
      <!-- 内容 -->
      <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
        <!-- 有几个节点就会循环几次，接收el-tree的节点数据并传入 -->
        <tree-tools slot-scope="{ data }" :data="data" @delDepts="getDepartmentsData" @addDepts="addDepts"
          @editDepts="editDepts" />
        <!-- 重新获取数据 -->
      </el-tree>
    </el-card>
    <!-- 添加部门弹出层 -->
    <add-depts ref="addDepts" :showDialog.sync="showDialog" :tree-node="nodeData" @addDepts="getDepartmentsData">
    </add-depts>
  </div>
</template>

<script>
import TreeTools from "./component/TreeTools";
import AddDepts from "./component/AddDept";

import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";

export default {
  components: {
    TreeTools,
    AddDepts,
  },
  data() {
    return {
      // 头部数据
      company: { name: "人事管理科技有限公司", manager: "负责人", id: "" },
      // 内容数据
      departs: [],
      defaultProps: {
        label: "name", //读取哪个属性的内容
      },
      showDialog: false, //是否显示弹出层
      nodeData: null, //当前点击的节点数据
    };
  },
  methods: {
    // 获取部门数据的方法
    async getDepartmentsData() {
      const result = await getDepartments();
      // 将数据转成树形结构数据,传入pid默认为空
      this.departs = tranListToTreeData(result.depts, "");
    },
    // 添加部门的方法
    addDepts(nodeData) {
      // 显示添加部门弹出层
      this.showDialog = true;
      // 保存当前点击的节点数据
      this.nodeData = nodeData;
    },
    // 编辑部门的方法
    editDepts(node) {
      // 打开弹出层
      this.showDialog = true;
      // 保存节点数据，编辑和添加保存到同一个data中的变量，因不可能一次同时点编辑和添加
      this.nodeData = node;
      // 调用获取详情信息的方法
      this.$refs.addDepts.getDepartDetail(this.nodeData.id);
    },
  },
  // 获取数据
  created() {
    this.getDepartmentsData(); //获取部门数据
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
