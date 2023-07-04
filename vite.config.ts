const path = require("path")

function pathResolve(dir: string) {
    return path.join(__dirname, dir);
}

module.exports = {
    // 服务端渲染
    ssr: false,
    // 是否开启 https
    https: false,
    // 设置目录别名
    alias: {
        // 键必须以斜线开始和结束
        '/@/': pathResolve('./src'),
        '/@components/': pathResolve('./src/components')
    },
    // 跨域设置
    proxy: {
    }
}
