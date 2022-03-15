<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link key="collapse" class="sidebar-logo-link" to="/">
        <img src="@/assets/common/logo.png" class="sidebar-logo" />
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;
  margin-top: 10px;
  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    // 大图样式
    & .sidebar-logo {
      width: 100px;
      vertical-align: middle;
      margin-right: 12px;
      margin-top: 10px;
    }
  }
  // 小图样式
  &.collapse {
    .sidebar-logo {
      width: 50px;
      margin-right: 0px;
    }
  }
}
</style>
