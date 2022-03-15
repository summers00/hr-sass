// 用户信息
import { getToken, setToken, removeToken, setTimeStamp } from "@/utils/auth";
import { getUserDetailById, getUserInfo, login } from "@/api/user";
import { resetRouter } from "@/router";

// 共享的状态
const state = {
  token: getToken(), //初始时从cookie中读取token
  userInfo: {}, //不能设null,避免用getters快捷访问时报错
};

// 修改状态
const mutations = {
  // 设置token的方法
  setToken(state, token) {
    // 修改token的状态
    state.token = token;
    // vuex的状态同步到缓存
    setToken(token);
  },

  // 删除token的方法
  removeToken(state) {
    // 将token数据清空
    state.token = null;
    // token的值同步到缓存
    removeToken();
  },

  // 修改用户信息的方法
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo; //响应式，一个对象赋值给另一个对象
    // state.userInfo = {...userInfo} //响应式，浅拷贝
  },

  // 删除用户信息(退出/切换时用)
  removeUserInfo(state) {
    state.userInfo = {}; //设为空对象
  },
};

// 异步操作
const actions = {
  // 登录的方法
  async login(context, data) {
    // 读取登录接口
    let result = await login(data);
    // 将token值提交修改给mutation的方法
    context.commit("setToken", result);
    // 拿到token说明登录成功,再设置时间戳
    setTimeStamp();
  },

  // 获取用户信息
  async getUserInfo(context) {
    // 读取用户信息接口
    const result = await getUserInfo();
    // 获取用户详情
    const userDetail = await getUserDetailById(result.userId);
    // 合并两个接口获得的数据
    // 提交修改
    context.commit("setUserInfo", { ...result, ...userDetail });
    return result; //权限时用
  },

  // 退出登录
  logout(context) {
    // 删除token
    context.commit("removeToken");
    // 删除用户资料
    context.commit("removeUserInfo");
    // 重置路由
    resetRouter();
    // 将vuex中的路由表重置为最初的状态
    // 加命名空间子模块之间的访问 第三个参数加{root:true} 加子模块的路径
    // 提交给子模块permission下的修改路由表的方法
    context.commit("permission/setRoutes", [], { root: true });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
