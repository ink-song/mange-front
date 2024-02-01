/*
 * @Author: ink-song 229135518@qq.com
 * @Date: 2024-01-18 21:25:29
 * @LastEditors: ink-song 229135518@qq.com
 * @LastEditTime: 2024-01-29 18:14:40
 * @FilePath: /manage-fe/src/store/userInfo.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getStorage, setStorage } from '@/utils/storage';
export default {
  state: () => ({
    userInfo: getStorage('userInfo') || {},
  }),
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      setStorage('userInfo', userInfo);
    },
    logout(state) {
      state.userInfo = {};
      setStorage('userInfo', {});
    },
  },
  actions: {
    SET_USER_INFO({ commit }, userInfo) {
      commit('setUserInfo', userInfo);
    },
    LOGOUT({ commit }) {
      commit('logout');
    },
  },
  getters: {
    userInfo: (state) => state.userInfo,
  },
};
