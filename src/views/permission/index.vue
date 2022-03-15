<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:right>
          <el-button type="primary" size="small" @click="addPermission(1, '0')"
            >添加权限</el-button
          >
        </template>
      </page-tools>
      <!-- 表格-->
      <!-- 设置row-key唯一标识(list数组中的id)才能显示树形-->
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <!-- 操作权限(第二层节点)下禁止添加子节点，type=1为访问权限 =2为功能权限 -->
            <el-button
              type="text"
              v-if="row.type === 1"
              @click="addPermission(2, row.id)"
              >添加</el-button
            >
            <el-button type="text" @click="getPermissionDetail(row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="delPermission(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增弹层 -->
      <!-- 放置一个弹层 用来编辑新增节点 -->
      <el-dialog :visible="showDialog" @close="btnCancel" :title="showTitle">
        <!-- 表单 -->
        <el-form
          ref="perForm"
          :model="formData"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width: 90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width: 90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width: 90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
            <!-- 值为1开启,0关闭 -->
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="btnOK"
              >确定</el-button
            >
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getPermissionList,
  addPermission,
  updatePermission,
  delPermission,
  getPermissionDetail,
} from "@/api/permission";
import { tranListToTreeData } from "@/utils";
export default {
  data() {
    return {
      list: [], //权限列表
      formData: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 关闭
      },
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
      showDialog: false,
    };
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    // 获取权限列表
    async getPermissionList() {
      // 将列表数据转为树形数据，根节点pid为0
      this.list = tranListToTreeData(await getPermissionList(), "0");
    },
    // 点击删除权限
    delPermission(id) {
      // 是否确认删除
      this.$confirm("确认删除该权限？").then(() => {
        // 调删除接口
        return delPermission(id).then(() => {
          // 删除成功，重新获取数据
          this.getPermissionList();
          // 提示
          this.$message.success("删除成功");
        });
      });
    },
    // 添加权限
    addPermission(type, pid) {
      // 页面和按钮权限区分：1)type1页面，type2按钮，2)添加位置：页面根节点(pid:0)，按钮子节点(pid:根节点id)
      // 保存类型和pid到formData
      this.formData.type = type;
      this.formData.pid = pid;
      // 打开弹层
      this.showDialog = true;
    },
    // 编辑权限
    async getPermissionDetail(id) {
      // 获取权限详情
      this.formData = await getPermissionDetail(id);
      this.showDialog = true;
    },
    // 点确定新增/编辑权限
    btnOK() {
      // 表单自定义校验
      this.$refs.perForm
        .validate()
        .then(() => {
          // 校验成功
          // 区分新增/编辑
          if (this.formData.id) {
            // 编辑,直接return不会向下执行
            return updatePermission(this.formData);
          }
          return addPermission(this.formData);
        })
        .then(() => {
          //调用接口成功后
          this.$message.success("操作成功");
          this.getPermissionList(); //重获数据
          // 关闭弹出层
          this.showDialog = false;
        });
    },
    // 点取消重置数据
    btnCancel() {
      this.formData = {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      };
      // 清除校验规则
      this.$refs.perForm.resetFields();
      // 关闭弹窗
      this.showDialog = false;
    },
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑权限" : "新增权限";
    },
  },
};
</script>

<style></style>
