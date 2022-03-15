<template>
  <el-dialog :visible="showDialog" :title="showTitle" @close="btnCancel">
    <!-- 内容 -->
    <el-form
      ref="deptForm"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <!-- 循环下拉列表 -->
          <el-option
            v-for="item in people"
            :key="item.id"
            :value="item.username"
            :label="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          type="textarea"
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          :rows="3"
        />
        <!-- :rows输入框行数，只对textarea有效 -->
      </el-form-item>
    </el-form>
    <!-- 尾部 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24份 -->
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments";
import { getEmployeeSimple } from "@/api/employees";
export default {
  props: {
    // 是否显示弹层
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 当前节点数据
    treeNode: {
      type: Object,
      default: null,
    },
  },
  data() {
    //部门名在同级部门下不允许有重复
    const validatorName = async (rule, value, callback) => {
      // 获取最新的所有节点数据
      const { depts } = await getDepartments();
      let isNameRepeat;
      // 如有id说明是编辑
      if (this.formData.id) {
        //编辑的校验
        // 除当前部门以外的同级部门，名字不能重复
        isNameRepeat = depts
          .filter(
            (item) =>
              item.id !== this.treeNode.id && item.pid === this.treeNode.pid
          ) //和当前节点pid相同的说明在同一个节点下
          .some((item) => item.name === value);
      } else {
        //新增的校验
        // 找当前节点(拿父组件的数据,需传入)的所有同级数据，不相同通过，相同则不通过
        // 根据当前节点id找所有子部门(子pid=父id)
        isNameRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value); //找到要校验字段和部门名相同的返回true，说明和同级其他子部门有重复
      }
      // 如重复提示错误，不重复通过
      isNameRepeat ? callback(new Error(`当前已存在${value}`)) : callback();
    };
    //部门编码在整个模块中不允许重复
    const validatorCode = async (rule, value, callback) => {
      // 获取最新所有节点数据
      const { depts } = await getDepartments();
      let isCodeRepeat;
      if (this.formData.id) {
        //编辑的校验规则
        // 所有节点找是否有重复的，排除当前节点
        isCodeRepeat = depts.some(
          (item) => item.id !== this.treeNode.id && item.code === value && value
        );
      } else {
        //新增的校验规则
        // 所有数据节点中找是否有重复的，且value不为空，历史code有可能为空
        isCodeRepeat = depts.some((item) => item.code === value && value);
      }

      isCodeRepeat ? callback(new Error(`部门中已存在${value}`)) : callback();
    };
    return {
      formData: {
        name: "", //部门名
        code: "", //编码
        manager: "", //负责人
        introduce: "", //介绍
      },
      rules: {
        name: [
          { required: true, message: "请输入部门名", trigger: "blur" },
          { min: 1, max: 50, message: "输入1-50个字符", trigger: "blur" },
          { validator: validatorName, trigger: "blur" },
        ],
        code: [
          { required: true, message: "请输入编码", trigger: "blur" },
          { min: 1, max: 50, message: "输入1-50个字符", trigger: "blur" },
          { validator: validatorCode, trigger: "blur" },
        ],
        manager: [{ required: true, message: "请输入负责人", trigger: "blur" }],
        introduce: [
          { required: true, message: "请输入介绍", trigger: "blur" },
          { min: 1, max: 300, message: "输入1-300个字符", trigger: "blur" },
        ],
      },
      people: [],
    };
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增子部门";
    },
  },
  methods: {
    // 获取员工列表的方法
    async getEmployeeSimple() {
      // 获取结果
      this.people = await getEmployeeSimple();
    },
    // 点击确定新增数据
    btnOk() {
      // 表单的手动校验
      this.$refs.deptForm.validate(async (isOk) => {
        // 如果验证通过
        if (isOk) {
          //有id说明是编辑
          if (this.formData.id) {
            // 调用编辑接口
            await updateDepartments(this.formData);
          } else {
            // 调用新增部门的接口,当前节点id(父)设为新增子节点pid
            await addDepartments({ ...this.formData, pid: this.treeNode.id });
          }
          // 前端数据变化，通知父组件重新获取所有节点
          this.$emit("addDepts");
          // 通知父组件关闭弹出层，语法糖：'update:props名',值
          this.$emit("update:showDialog", false);
        }
      });
    },
    // 取消按钮的点击
    btnCancel() {
      // resetFields只重置表单数据，编辑时添加的id等数据不会清除，要手动清除
      (this.formData = {
        name: "", //部门名
        code: "", //编码
        manager: "", //负责人
        introduce: "", //介绍
      }),
        // 关闭弹层
        this.$emit("update:showDialog", false);
      // 表单数据重置，清除校验规则
      this.$refs.deptForm.resetFields();
    },
    // 获取节点详情
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id); //props传值是异步的，这里直接写props中的数据(this.treeNode.id)可能还没传入进来，获取不到，需要调用方法时传进来参数
    },
  },
};
</script>

<style>
</style>