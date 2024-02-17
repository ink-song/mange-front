import { getStorage, setStorage } from '@/utils/storage';
import { getApproveCountApi } from '@/api/approve';
export default {
  states: () => ({
    noticeCount: getStorage('count') || 0,
  }),
  actions: {
    async SET_NOTICE_COUNT({ commit }) {
      try {
        const { data } = await getApproveCountApi();
        commit('setNoticeCount', data);
      } catch (error) {}
    },
  },
  mutations: {
    setNoticeCount(state, count) {
      state.noticeCount = count;
      setStorage('count', count);
    },
  },
  getters: {
    noticeCount: (state) => state.noticeCount,
  },
};
