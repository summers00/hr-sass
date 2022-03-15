<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <div class="app-breadcrumb">
      人事管理科技有限公司
      <span class="breadBtn">体验版</span>
    </div>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-imgerror="defaultImg" :src="staffPhoto" class="user-avatar" />
          <span class="user">{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://gitee.com/summer-_0/hr-management-system">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>

          <!-- 退出登录 -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      defaultImg: require("@/assets/common/bigUserHeader.png"), //避免打包后图片路径发生变化,用require
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name", "staffPhoto"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    // 登出
    async logout() {
      // 调用actions的登出方法
      await this.$store.dispatch("user/logout"); //logout是同步,写不写await都可
      // 跳到登录
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #3f76f5;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .app-breadcrumb {
    display: inline-block;
    line-height: 46px;
    font-size: 18px;
    color: #fff;
    .breadBtn {
      display: inline-block;
      height: 25px;
      line-height: 25px;
      margin-left: 10px;
      padding: 0 5px;
      background: #84a9fe;
      border-radius: 10px;
      font-size: 12px;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        cursor: pointer;
        // 头像
        .user-avatar {
          cursor: pointer;
          width: 35px;
          height: 35px;
          vertical-align: middle;
          border-radius: 10px;
        }
        // 用户
        .user {
          vertical-align: middle;
          margin-left: 8px;
          color: #fff;
          font-size: 16px;
        }
        // 图标
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 14px;
          color: #fff;
        }
      }
    }
  }
}
</style>
