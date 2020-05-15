const app = {
  state: {
    btns: []
  },
  mutations: {
    // 控制按钮权限
    SET_BTNS: (state, btns) => {
      state.btns = btns;
    }
  },
  actions: {
    setBtns({ commit }, btns) {
      commit("SET_BTNS", btns);
    }
  }
};

export default app;
