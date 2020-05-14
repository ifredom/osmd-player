const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  // 项目部署的基础路径
  // 我们默认假设你的应用将会部署在域名的根部，
  // 比如 https://www.my-app.com/
  // 如果你的应用时部署在一个子路径下，那么你需要在这里
  // 指定子路径。比如，如果你的应用部署在
  // https://www.foobar.com/my-app/
  // 那么将这个值改为 `/my-app/`
  publicPath: "./",
  // 将构建好的文件输出到哪里
  outputDir: "dist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    port: 9402,
    https: false,
    open: false, // 配置自动启动浏览器
    disableHostCheck: true,
    proxy: {
      "/piano/piano": {
        target: "http://test.youxspace.com/piano/piano",
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          "^/piano/piano": ""
        }
      },
      "/ossupload": {
        target: "http://yxspace.oss-cn-zhangjiakou.aliyuncs.com", // 你接口的域名
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          "^/upload": ""
        }
      }
    }
  },
  pwa: {
    name: "ifredom PWA App",
    themeColor: "#4DBA87",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/registerServiceWorker.js"
    }
  },
  // 默认情况下 babel-loader 忽略其中的所有文件 node_modules
  transpileDependencies: [],
  // 生产环境 sourceMap
  productionSourceMap: false,
  // 构建时开启多进程处理 babel 编译
  parallel: require("os").cpus().length > 1,
  chainWebpack: config => {
    // 使用cdn文件，忽略打包。会导致调试工具无法开启
    config.externals({
      musicXML: "musicXML",
      sounds: "sounds"
    });

    // 添加别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@theme", resolve("theme"))
      .set("@assets", resolve("src/assets"))
      .set("@com", resolve("src/components"));

    // 兼容老版本浏览器
    const entry = config.entry("app");
    entry.add("babel-polyfill").end();
    entry.add("classlist-polyfill").end();

    // 处理所有svg图片
    config.module.rules.delete("svg"); // 重点:删除默认配置中处理svg,
    config.module
      .rule("svg-sprite-loader")
      .test(/\.svg$/)
      .include.add(resolve("src/icons")) // 处理svg目录
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });

    // 模块分析
    if (process.env.NODE_ENV === "production") {
      config.plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  // webpack 配置，键值对象时会合并配置，为方法时会改写配置
  // https://cli.vuejs.org/guide/webpack.html#simple-configuration
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      // 源码部分：@vue/cli-service/lib/util/resolveClientEnv.js 在根目录的 vue.config.js 中配置 baseUrl
    }
  },
  css: {
    // loaderOptions: {
    //   postcss: {
    //     plugins: [
    //       require('postcss-pxtorem')({
    //         rootValue: 192, // 换算的基数
    //         selectorBlackList: [], // 忽略转换正则匹配项
    //         propList: ['*']
    //       })
    //     ]
    //   }
    // }
  }
};
