import { fileURLToPath, URL } from "node:url";
import fs from "fs";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";

import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import { createSvgIconsPlugin } from "@digitalacorn/vite-plugin-svg-icons";
import path from "path";
import mockDevServerPlugin from "vite-plugin-mock-dev-server";
import viteCompression from "vite-plugin-compression";
import { createHtmlPlugin } from "vite-plugin-html";
import { enableCDN } from "./build/cdn";

// 当前工作目录路径
const root: string = process.cwd();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 环境变量
  const env = loadEnv(mode, root, "");
  return {
    base: env.VITE_PUBLIC_PATH || "/",
    plugins: [
      vue(),
      vueJsx(),
      mockDevServerPlugin(),
      // vant 组件自动按需引入
      Components({
        dts: "src/typings/components.d.ts",
        resolvers: [VantResolver()],
      }),
      // svg icon
      createSvgIconsPlugin({
        // 指定图标文件夹
        iconDirs: [path.resolve(root, "src/icons/svg")],
        // 指定 symbolId 格式
        symbolId: "icon-[dir]-[name]",
        replaceStrokeWithCurrentColor: false,

        // svgoOptions: {
        //   full: true,
        //   plugins: [
        //     {
        //       name: "removeAttrs",
        //       params: {
        //         attrs: "fill",
        //       },
        //     },
        //   ],
        // },
      }),
      // 生产环境 gzip 压缩资源
      viteCompression(),
      // 注入模板数据
      createHtmlPlugin({
        inject: {
          data: {
            ENABLE_ERUDA: env.VITE_ENABLE_ERUDA || "false",
          },
        },
      }),
      // 生产环境默认不启用 CDN 加速
      enableCDN(env.VITE_CDN_DEPS),
      AutoImport({
        imports: [
          "vue", // 自动导入 Vue 相关 API
          "vue-router", // 路由相关（若需要）
          "pinia", // 状态管理（若需要）
        ],
        dts: true, // 生成 auto-imports.d.ts 类型声明文件
        eslintrc: {
          // 更新 ESLint 配置
          enabled: true,
        },
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: true,
      // https: {
      //   key: fs.readFileSync(
      //     path.resolve(__dirname, "./mock/ssl/localhost-key.pem")
      //   ),
      //   cert: fs.readFileSync(
      //     path.resolve(__dirname, "./mock/ssl/localhost.pem")
      //   )
      // },
      // 仅在 proxy 中配置的代理前缀， mock-dev-server 才会拦截并 mock
      // doc: https://github.com/pengzhanbo/vite-plugin-mock-dev-server
      proxy: {
        [env.VITE_BASE_API]: {
          target: env.VITE_BACKEND_DOMAIN,
          changeOrigin: true,
          ws: true,
          preserveHeaderKeyCase: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
        sourcemap: true,
      },
    },
  };
});
