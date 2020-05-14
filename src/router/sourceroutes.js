
export const constantRouterMap = [
  {
    path: "/",
    redirect: "/home",
    hidden: true
  },
  {
    name: "乐谱",
    path: "/home",
    component: resolve => require(["@/pages/home/score"], resolve),
    meta: {
      title: "乐谱"
    }
  },
];

export const asynAddRouterMap = [
  // {
  //   name: 'HelloWorld',
  //   path: '/HelloWorld',
  //   component: () => import('@/pages/testrouter/HelloWorld'),
  //   children: [...Testrouter],
  // },
];
export default constantRouterMap;
