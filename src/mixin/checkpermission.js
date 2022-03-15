import store from "@/store";
export default {
  //混入对象
  methods: {
    checkPermission(key) {
      //key权限点标识
      // 用户信息point找有没有key,找到说明有权限，没找到没权限
      const { userInfo } = store.state.user; //user子模块下找userInfo
      // vuex中有points再去找
      if (userInfo.roles.points && userInfo.roles.points.length) {
        return userInfo.roles.points.some((item) => item === key); //找到返回true
      }
      return false; //没有points说明没有权限
    },
  },
};
