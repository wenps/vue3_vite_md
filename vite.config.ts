import path from "path";
import { defineConfig } from 'vite'
import createVuePlugin from '@vitejs/plugin-vue'
import vuePluginsMdToVue from "./src/plugins/vuePluginsMdToVue";
const vuePlugin = createVuePlugin({ include: [/\.vue$/, /\.md$/] })


export default defineConfig({
    resolve: {  
        // 设置目录别名
        alias: {
            // 键必须以斜线开始和结束
            '@': path.resolve(__dirname, './src'),
            'components': path.resolve(__dirname, './src/components'),
            'core': path.resolve(__dirname, './src/core'),
            'assets': path.resolve(__dirname, './src/assets'),
            'interface': path.resolve(__dirname, './src/interface'),
            'plugins': path.resolve(__dirname, './src/plugins'),
        },
    },
    plugins: [
        vuePluginsMdToVue({componentsPath:'./src/components',rootPath:__dirname}),
        vuePlugin
    ]
});