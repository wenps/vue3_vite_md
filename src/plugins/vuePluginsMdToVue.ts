import {marked} from 'marked';
import path from "path";
import fs  from "fs";

let components:any = [] // 存储md中出现的所有vue组件
let Path: any = {} // 存放组件相关地址的目录
let registerComponentNameList: string[] = [] // 获取注册的组件名称列表

export default function vuePluginsMdToVue(pathObj:any) {
  return {
    name: 'vue-plugins-md-to-vue',
    transform(code:any, path:any) {
      components = [] // 重置components
      Path = pathObj

      if (path.endsWith('.md')) {
          // 解析md文档为tokens数组
          const tokens = marked.lexer(code)
          
          // 获取所有在组件文件夹下出现的组件名
          registerComponentNameList = getRegisterComponentNameList() // 获取注册的组件名称列表
          // 将数组转成html
          const html = marked.parser(tokens, {
              gfm: true,    
              renderer: componentRender() 
          });
          
          // 基于html和md文件路径生成SFC
          const SFC = SFCRender(html, path)
          return {code: SFC, map: null}
      }
    }
  }
}

// 组件html解析
function componentRender(wrapCodeWithCard = true) {
  const renderer = new marked.Renderer()

  renderer.html = function (html:any) {
      // 获取html代码中出现的所有标签
      const regex = /<([^>\/\s]+)(?:\s+[^>]+)?>/g;
      const templateTags = html.match(regex).map((tag:any) => {
          const tagRel = tag.replace(/[<>]/g, '')
          if(tagRel.includes(" ")) {
              return tagRel.split(" ")[0];
          }
          return tagRel
      });
      
      // 将出现的所有vue组件都存储到components中并去重
      components = [...new Set([...components, ...templateTags.filter((tag:any) => registerComponentNameList.includes(tag))])];
      
      return html
  }
  return renderer
}

function getRegisterComponentNameList(): string[] {
  const list: string[] = [];
  try {
    const files = fs.readdirSync(Path.componentsPath);
    files.forEach((file) => {
      list.push(path.parse(file).name);
    });
  } catch (err) {
    console.error('无法读取文件夹:', err);
  }
  return list;
}

// 构造SFC
function SFCRender(html:string, mdPath:string) {
  const importComponent = components
  .map((item:any) => `import ${item} from '${getRelativePath(item, mdPath)}.vue'`)
  .join('\n')
const registerComponent = components
  .map((item:any) => item)
  .join(',\n')
  const SFC = `
    <template>
        <div>
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

// 获取相对路径
function getRelativePath (item:string, mdPath:string) {
    const filePath = mdPath
    const targetPath = path.join(Path.rootPath, Path.componentsPath + `/${item}`)
    const relativePath = path.relative(path.dirname(filePath), targetPath);
    const componentsRelativePath = relativePath.replace(/\\/g, '/')
    
    
    return componentsRelativePath
}
