<template>
  <div class="detail-container">
    <el-card>
      <el-tabs>
        <el-tab-pane label="登录账户设置">
          <!-- 放置表单 -->
          <el-form
            ref="formData"
            :model="formData"
            :rules="rules"
            label-width="120px"
            style="margin-left: 120px; margin-top: 30px"
          >
            <el-form-item label="姓名:" prop="username">
              <el-input style="width: 300px" v-model="formData.username" />
            </el-form-item>
            <el-form-item label="密码:" prop="password2">
              <el-input
                style="width: 300px"
                type="password"
                v-model="formData.password2"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveUser">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="个人详情">
          <el-row type="flex" justify="end">
            <el-tooltip content="打印个人基本信息">
              <router-link :to="`/employees/print/${userId}?type=personal`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
          </el-row>
          <!-- 点击切换为element内置组件 -->
          <!-- <button @click="userComponent='el-button'">切换组件</button>
          <button @click="userComponent='UserInfo'">切回详情</button> -->
          <!-- 动态组件，可切换为其他组件，is绑定一个变量 -->
          <component :is="userComponent"></component>
        </el-tab-pane>

        <el-tab-pane label="岗位信息">
          <el-row type="flex" justify="end">
            <el-tooltip content="打印岗位信息">
              <router-link :to="`/employees/print/${userId}?type=job`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
          </el-row>
          <component :is="jobComponent"></component>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById } from "@/api/user";
import { saveUserDetailById } from "@/api/employees";
import UserInfo from "./component/UserInfo.vue";
import JobInfo from "./component/JobInfo.vue";
export default {
  components: {
    UserInfo,
    JobInfo,
  },
  data() {
    return {
      userComponent: "UserInfo", //动态组件
      jobComponent: "JobInfo",
      userId: this.$route.params.id, //用户id
      formData: {
        //表单数据
        username: "",
        password2: "",
      },
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        // 避免不改密码点更新会把密码设为加密后的，先设和后端不一样的字段名，请求接口时将这个字段传入data参数
        password2: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 9, message: "密码长度6-9位", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserDetailById();
  },
  methods: {
    // 获取用户基本信息
    async getUserDetailById() {
      // 获取用户基本信息
      this.formData = await getUserDetailById(this.userId);
    },
    // 点更新保存用户
    async saveUser() {
      try {
        // 表单校验
        await this.$refs.formData.validate();
        // 调保存接口，传入数据
        await saveUserDetailById({
          ...this.formData,
          password: this.formData.password2,
        }); //后面的属性会覆盖掉前面的
        // 提示
        this.$message.success("设置成功");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style></style>
