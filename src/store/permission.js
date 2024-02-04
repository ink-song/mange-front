import { getStorage, setStorage } from '@/utils/storage';

import { getPermissionTreeApi } from '@/api/menu';

export default {
  state: () => ({
    permissionList: getStorage('permissionList') || [],
    actionsList: getStorage('actionsList') || [],
  }),
  mutations: {
    setPermissionList(state, permissionList) {
      state.permissionList = permissionList;
      setStorage('permissionList', permissionList);
    },
    setActionsList(state, actionsList) {
      state.actionsList = actionsList;
      setStorage('actionsList', actionsList);
    },
  },
  actions: {
    async SET_PERMISSION_LIST({ commit }) {
      try {
        const { data } = await getPermissionTreeApi();
        commit('setPermissionList', data.menuList);
      } catch (error) {}
    },
    async SET_ACTIONS_LIST({ commit }) {
      try {
        const { data } = await getPermissionTreeApi();
        commit('setActionsList', data.actionList);
      } catch (error) {}
    },
  },
  getters: {
    permissionList: (state) => state.permissionList,
    actionsList: (state) => state.actionsList,
  },
};
