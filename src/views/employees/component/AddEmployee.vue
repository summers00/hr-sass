<template>
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    @close="btnCancel"
    v-if="!checkPermission('add-depts')"
  >
    <!-- 表单 -->
    <el-form
      label-width="120px"
      :model="formData"
      :rules="rules"
      ref="employeeForm"
    >
      <el-form-item label="姓名" prop="username">
        <el-input
          style="width: 50%"
          placeholder="请输入姓名"
          v-model="formData.username"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          style="width: 50%"
          placeholder="请输入手机号"
          v-model="formData.mobile"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <!-- 日期选择器 -->
        <el-date-picker
          style="width: 50%"
          placeholder="请选择入职时间"
          v-model="formData.timeOfEntry"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          style="width: 50%"
          placeholder="请选择"
          v-model="formData.formOfEmployment"
        >
          <!-- 遍历枚举数据 -->
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :value="item.id"
            :label="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          style="width: 50%"
          placeholder="请输入工号"
          v-model="formData.workNumber"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          style="width: 50%"
          placeholder="请选择部门"
          v-model="formData.departmentName"
          @focus="getDepartments"
        />
        <!-- 树形结构 -->
        <el-tree
          v-if="showTree"
          :data="treeNode"
          :props="{ label: 'name' }"
          default-expand-all
          v-loading="loading"
          @node-click="selectNode"
        ></el-tree>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          style="width: 50%"
          placeholder="请选择转正时间"
          v-model="formData.correctionTime"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";
import { addEmployee } from "@/api/employees";
// 枚举数据
import EmployeeEnum from "@/api/constant/employees";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        //对应接口字段名
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },
      rules: {
        //校验规则
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          { min: 1, max: 4, message: "用户姓名为1-4位", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          // input和tree不是同一个，离开焦点是为了选tree这时校验会提示，校验方式为值改变change
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
      // 接收部门数据
      treeNode: [],
      // 是否显示加载
      loading: false,
      // 是否显示树
      showTree: false,
      // 枚举数据
      EmployeeEnum,
    };
  },
  methods: {
    // 表单获取焦点时加载部门数据
    async getDepartments() {
      // 显示树形
      this.showTree = true;
      // 显示加载
      this.loading = true;
      // 调获取部门接口
      const { depts } = await getDepartments();
      // 列表数据转为树形结构
      this.treeNode = tranListToTreeData(depts, "");
      this.loading = false;
    },
    // 树形点击事件
    selectNode(node) {
      // 当前节点对象name存到表单绑定数据上
      this.formData.departmentName = node.name;
      this.showTree = false;
    },
    // 点确定新增员工
    async btnOk() {
      try {
        await this.$refs.employeeForm.validate();
        // 校验成功
        // 调新增接口
        await addEmployee(this.formData);
        // 重获员工列表数据，直接调用父组件方法(不常用)
        this.$parent.getEmployeeList();
        // 关闭弹层会触发close事件，该事件绑定了btnCancel方法，故不做清空数据
        this.$parent.showDialog = false;
      } catch (error) {
        console.log(error);
      }
    },
    // 点取消清空数据
    btnCancel() {
      // 重置数据
      this.formData = {
        //对应接口字段名
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      };
      // 清除校验规则
      this.$refs.employeeForm.resetFields();
      // 关闭弹层,通知父组件
      this.$emit("update:showDialog", false);
    },
  },
};
</script>

<style></style>
