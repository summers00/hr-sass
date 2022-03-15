<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- 绑定当前用户拥有的角色 -->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{
        item.name
      }}</el-checkbox>
      <!-- label存储值 -->
    </el-checkbox-group>

    <!-- 底部 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/settings";
import { assignRoles } from "@/api/employees";
import { getUserDetailById } from "@/api/user";
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      roleList: [], //角色列表
      roleIds: [], //当前用户所拥有的角色id
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      // 获取角色
      const { rows } = await getRoleList({ page: 1, pagesize: 20 }); //默认最多20个角色
      this.roleList = rows;
    },
    // 获取当前用户拥有的角色
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id); //id需父组件传入,不能直接用props中的,因为是异步的获取不到
      this.roleIds = roleIds;
    },
    // 点击确定设置角色
    async btnOk() {
      // 根据员工id和角色请求设置角色的接口
      await assignRoles({ id: this.userId, roleIds: this.roleIds });
      // 通知父组件关闭弹层
      this.$emit("update:showRoleDialog", false);
    },
    // 点击取消清空数据
    btnCancel() {
      this.roleIds = [];
      // 通知父组件关闭弹层
      this.$emit("update:showRoleDialog", false);
    },
  },
};
</script>

<style></style>
