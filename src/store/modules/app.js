import Cookies from "js-cookie";

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get("sidebarStatus"),
      withoutAnimation: false
    },
    menu: [],
    device: "desktop",
    size: Cookies.get("size") || "medium",
    btns: []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set("sidebarStatus", 1);
      } else {
        Cookies.set("sidebarStatus", 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set("sidebarStatus", 1);
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
    SET_SIZE: (state, size) => {
      state.size = size;
      Cookies.set("size", size);
    },
    SET_MENU: (state, menu) => {
      state.menu = menu;
    },
    // 控制按钮权限
    SET_BTNS: (state, btns) => {
      state.btns = btns;
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit("TOGGLE_SIDEBAR");
    },
    CloseSideBar ({ commit }, { withoutAnimation }) {
      commit("CLOSE_SIDEBAR", withoutAnimation);
    },
    ToggleDevice ({ commit }, device) {
      commit("TOGGLE_DEVICE", device);
    },
    setSize({ commit }, size) {
      commit("SET_SIZE", size);
    },
    setMenu({ commit }, menu) {
      commit("SET_MENU", menu);
    },
    setBtns({ commit }, btns) {
      commit("SET_BTNS", btns);
    }
  }
};

export default app;
