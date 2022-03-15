<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
      label-position="left">
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" />
        </h3>
      </div>

      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="mobile" v-model="loginForm.mobile" placeholder="请输入手机号" name="mobile" type="text" tabindex="1"
          auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
          placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" class="loginBtn" type="primary" style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin">登录</el-button>

      <div class="tips">
        <span style="margin-right: 20px">账号：13800000002</span>
        <span>密码：123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validMoblie } from "@/utils/validate";
import { mapActions } from "vuex";

export default {
  name: "Login",
  data() {
    const validateMoblie = (rule, value, callback) => {
      validMoblie(value) ? callback() : callback(new Error("手机号格式不正确"));
    };
    return {
      loginForm: {
        mobile: "13800000003",
        password: "123456",
      },
      loginRules: {
        mobile: [
          { required: true, trigger: "blur", message: "请输入手机号" },
          { validator: validateMoblie, trigger: "blur" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入密码" },
          { trigger: "blur", min: 6, max: 16, message: "请输入6-16位密码" },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    // user模块是封闭的，要加子模块
    ...mapActions(["user/login"]),
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    // 监听登录按钮的点击和回车
    handleLogin() {
      // 手动对整个表单校验，校验后执行回调，1:是否校验成功，2.未通过的字段
      this.$refs.loginForm.validate(async (isOk) => {
        // 如果校验通过
        if (isOk) {
          try {
            // 发送登录前打开加载
            this.loading = true;
            // 调用actions内的方法,有路径不能用点，要加中括号
            // async标记的是promise对象，即actions中login方法是promise对象,强制等待用await，而所在回调函数要标记async
            await this["user/login"](this.loginForm);
            //await下面的代码都是成功执行后的，如捕获错误用try..catch,而actions中如果响应失败success为false会提示错误，这里不需处理
            this.$router.push("/");
          } catch (error) {
            // 捕获错误
            console.log(error);
          } finally {
            // 不论执行的是try还是catch,都关闭加载
            this.loading = false;
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_blue: #68b0fe;
$cursor: #68b0fe;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_blue;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }

  .loginBtn {
    background: #407ffe;
    font-size: 20px;
  }

  // 错误信息
  .el-form-item__error {
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  background-image: url('~@/assets/common/login.jpg');
  background-position: center;
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 13px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
