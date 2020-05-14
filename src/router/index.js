import Vue from "vue";
import Router from "vue-router";
import sourceroutes from "./sourceroutes";

// 在development环境中不使用延迟加载， 因为延迟加载太多的页面会导致webpack热更新太慢。 因此， 只有在生产中使用延迟加载;
// 详情: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

/**
* hidden: true                如果hidden的值为 true，则不会显示在侧栏中(默认为false)
* alwaysShow: true            如果设置为true， 将始终显示根菜单， 无论其子路由长度如何
                              如果不设置 alwaysShow， 则只有当子路由children中多于一个时， 会形成嵌套， 否则硻根菜单
* redirect: noredirect        如果 `redirect:noredirect`不会在面包屑中重定向
* name: 'router-name'         该名称由 < keep - alive >缓存时使用，（必须设置！！）
* meta : {
    title: 'title'               面包屑菜单中的名字 (建议设置)
    icon: 'svg-name'             菜单树中的图标
    breadcrumb: false            如果设置为false,那么在面包屑中不限显示（默认为true）
  }
**/

// 返回上一级页面的浏览位置
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition;
  } else {
    return {
      x: 0,
      y: 0
    };
  }
};

/**
 * @arguments routes 自定义的路由
 * @arguments sourceroutes 官方模板中的路由
 */

const router = new Router({
  base: "/",
  mode: "hash", // 后端支持可设置为： history
  routes: sourceroutes,
  scrollBehavior
});

export default router;
