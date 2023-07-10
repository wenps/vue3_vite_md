import path from "path";
import {marked} from 'marked';
import { tags } from "./src/contents/tags";
import { defineConfig } from 'vite'
import createVuePlugin from '@vitejs/plugin-vue'
const vuePlugin = createVuePlugin({ include: [/\.vue$/, /\.md$/] })
let components:any = []

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
        {
            name: 'print-code',
            transform(code, id) {
                if (id.endsWith('.md')) {
                    // 解析md文档为数组
                    const raws = marked.lexer(code)
                    // 将数组转成html
                    const html = marked.parser(raws, {
                        gfm: true,    
                        renderer: componentRender() 
                    });
                    // 基于html生成SFC
                    const SFC = SFCRender(html)
                    
                    return {code: SFC, map: null}
                }
            }
        },
        vuePlugin
    ]
});

// 组件html解析
function componentRender(wrapCodeWithCard = true) {
    const renderer = new marked.Renderer()
  
    renderer.html = function (html:any) {
        const regex = /<([^>\/\s]+)(?:\s+[^>]+)?>/g;
        const templateTags = html.match(regex).map((tag:any) => {
            const tagRel = tag.replace(/[<>]/g, '')
            if(tagRel.includes(" ")) {
                return tagRel.split(" ")[0];
            }
            return tagRel
        });
        components = templateTags.filter((tag:any) => !tags.includes(tag));
        return html
    }
    return renderer
}

// 构造SFC
function SFCRender(html:string) {
    const importComponent = components
    .map((item:any) => `import ${item} from 'components/${item}.vue'`)
    .join('\n')
  const registerComponent = components
    .map((item:any) => item)
    .join(',\n')
    const SFC = `
    <template>
        <div class="main">
            ${html}
        </div>
    </template>
    <script>
        ${importComponent}
        export default {
            components: {
              ${registerComponent}
            },
        }
    </script>
    `
    return SFC
}