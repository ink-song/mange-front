import { getStorage, setStorage } from '@/utils/storage';

export default {
  stsate: () => ({
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
    SET_PERMISSION_LIST({ commit }, permissionList) {
      commit('setPermissionList', permissionList);
    },
    SET_ACTIONS_LIST({ commit }, actionsList) {
      commit('setActionsList', actionsList);
    },
  },
};
