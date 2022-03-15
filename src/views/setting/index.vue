<template>
  <div class="settings-container">
    <el-card>
      <el-tabs>
        <!-- 左侧 -->
        <el-tab-pane label="角色管理">
          <el-row style="height: 60px">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              style="margin-top: 10px"
              @click="showDialog = true"
              >新增角色</el-button
            >
          </el-row>
          <!-- 表格 -->
          <el-table border="" :data="list">
            <el-table-column
              type="index"
              align="center"
              label="序号"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="name"
              align="center"
              label="角色名"
              width="240"
            ></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column label="操作">
              <!-- 作用域插槽 当前点击行的数据 -->
              <template slot-scope="{ row }">
                <el-button
                  size="small"
                  type="success"
                  @click="assignPerm(row.id)"
                  >分配权限</el-button
                >
                <el-button size="small" type="primary" @click="editRole(row.id)"
                  >修改</el-button
                >
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteRole(row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-row
            type="flex"
            justify="center"
            style="height: 60px"
            align="middle"
          >
            <el-pagination
              layout="prev,pager,next"
              :total="page.total"
              :page-size="page.pagesize"
              :current-page="page.page"
              @current-change="changePage"
            ></el-pagination>
          </el-row>
        </el-tab-pane>
        <!-- 右侧 -->
        <el-tab-pane label="公司信息">
          <!-- 提示 -->
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <!-- 表单 -->
          <el-form label-width="120px" style="margin-top: 30px">
            <el-form-item label="公司名称">
              <el-input disabled style="width: 400px" v-model="formData.name" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input
                disabled
                style="width: 400px"
                v-model="formData.companyAddress"
              />
            </el-form-item>
            <el-form-item label="公司电话">
              <el-input
                disabled
                style="width: 400px"
                v-model="formData.companyPhone"
              />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input
                disabled
                style="width: 400px"
                v-model="formData.mailbox"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                disabled
                type="textarea"
                :rows="3"
                style="width: 400px"
                v-model="formData.remarks"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 编辑弹层 -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
      <!-- 内容 -->
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 分配权限弹层 -->
    <el-dialog
      title="分配权限"
      :visible="showPermDialog"
      @close="btnPermCancel"
    >
      <!-- 权限树 -->
      <!-- check-strictly不关联子节点,可单独选择子节点 -->
      <el-tree
        :data="permList"
        :props="defaultProps"
        default-expand-all
        show-checkbox
        check-strictly
        node-key="id"
        :default-checked-keys="permIds"
        ref="permTree"
      />

      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK"
            >确定</el-button
          >
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
} from "@/api/settings.js";
import { getPermissionList } from "@/api/permission";
import { assignPerm } from "@/api/settings";
import { tranListToTreeData } from "@/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      list: [], //接收角色列表
      page: {
        //页码信息
        page: 1, //页码
        pagesize: 10, //每页条数
        total: 0, //总数
      },
      formData: {}, //公司信息
      roleForm: {
        //角色信息，对应接口中的名字
        name: "", //角色名
        description: "", //角色描述
      },
      showDialog: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      showPermDialog: false, //是否显示权限弹层
      roleId: "",
      permList: [], //权限列表
      defaultProps: {
        //显示节点的字段名
        label: "name",
      },
      permIds: [], //当前角色所拥有权限
    };
  },
  computed: {
    ...mapGetters(["companyId"]),
    showTitle() {
      return this.roleForm.id ? "编辑部门" : "新增部门";
    },
  },
  created() {
    // 调用获取请求结果的方法
    this.getRoleList();
    // 调用获取公司信息的方法
    this.getCompanyInfo();
  },
  methods: {
    // 获取角色列表的方法
    async getRoleList() {
      // 调用接口,传入page页码pagesize每页条数,保存数组
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total;
      this.list = rows;
    },
    // 获取公司信息的方法
    async getCompanyInfo() {
      // 调用接口,保存结果
      this.formData = await getCompanyInfo(this.companyId);
    },

    // 点击切换页码时触发
    changePage(newPage) {
      //page当前页
      // 保存当前页
      this.page.page = newPage;
      // 重新获取角色数据
      this.getRoleList();
    },
    // 点击删除时触发
    async deleteRole(id) {
      try {
        // 删除提示(成功进then,失败进catch)用await需捕获错误
        await this.$confirm("是否确认删除");
        // await下面是点击确定之后的，点取消会报错，try..catch捕获错误
        // 调删除接口
        await deleteRole(id);
        // 删除成功，前端重新获取数据
        this.getRoleList();
        // 显示提示
        this.$message.success("用户删除成功");
      } catch (error) {
        console.log(error);
      }
    },
    // 点击编辑时触发
    async editRole(id) {
      // 避免闪烁问题(获取数据需要时间)，先获取数据再打开弹层
      // 获取角色详情，存到表单数据，实现数据回写
      this.roleForm = await getRoleDetail(id);
      // 打开弹层
      this.showDialog = true;
    },
    // 点击确定按钮
    async btnOk() {
      try {
        // 整个表单手动校验,不传回调会返回Promise对象
        await this.$refs.roleForm.validate();
        // await下面是校验成功后的，校验失败会报错，用try..catch捕获错误
        // 如表单对象中有id说明是编辑操作
        if (this.roleForm.id) {
          // 调用设置角色接口
          await updateRole(this.roleForm);
        } else {
          //没id是新增操作
          // 调新增角色接口
          await addRole(this.roleForm);
        }
        // 前端页面重新获取数据
        this.getRoleList();
        // 提示操作成功
        this.$message.success("操作成功");
        // 关闭弹窗会触发close事件，close绑定了btnCancel方法，清除数据，所以确定按钮不需做数据的重置
        this.showDialog = false;
      } catch (error) {
        console.log(error);
      }
    },
    // 点击取消
    btnCancel() {
      // 清空数据
      this.roleForm = {
        name: "",
        description: "",
      };
      // 清除校验规则
      this.$refs.roleForm.resetFields();
      // 关闭弹层
      this.showDialog = false;
    },
    // 点分配权限获取数据
    async assignPerm(roleId) {
      // 保存角色id
      this.roleId = roleId;
      // 获取权限, 列表数据转为树形数据
      this.permList = tranListToTreeData(await getPermissionList(), "0");
      // 根据id获取角色对应权限点
      const { permIds } = await getRoleDetail(roleId);
      // 保存当前用户所拥有权限
      this.permIds = permIds;
      this.showPermDialog = true;
    },
    async btnPermOK() {
      // this.$refs.permTree.getCheckedKeys() 当前选中所有节点id(el-tree绑定了nodekey为id)的数组
      // 参数:当前选中的所有权限,当前要分配的角色id
      // 给角色分配权限
      await assignPerm({
        id: this.roleId,
        permIds: this.$refs.permTree.getCheckedKeys(),
      });
      this.$message.success("设置成功");
      this.showPermDialog = false;
    },
    btnPermCancel() {
      // 清空当前角色所拥有权限数据(会显示默认权限数据)
      this.permIds = [];
      this.showPermDialog = false;
    },
  },
};
</script>

<style></style>
