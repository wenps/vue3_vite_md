import {marked} from 'marked';
import path from "path";
import fs  from "fs";

let components: string[] = []; // 存储md中出现的所有vue组件
let Path: any = {}; // 存放组件相关地址的目录
let registerComponentNameList: string[] = []; // 获取注册的组件名称列表
let scriptContents: any[] = []; // 自定义的脚本内容
let scriptAttributes: any[] = []; // 自定义的脚本属性
let cssContents: any[] = []; // 自定义的样式内容
let cssAttributes: any[] = []; // 自定义的样式属性

// md转vue插件
export default function vuePluginsMdToVue(pathObj:any) {
  return {
    name: 'vue-plugins-md-to-vue',
    transform(code:any, path:any) {
      // 初始化数据
      initData()
      Path = pathObj
      // 处理md文件
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

// 数据重置
function initData() {
  components= [];
  Path= {};
  registerComponentNameList= [];
  scriptContents= [];
  scriptAttributes= [];
  cssContents= [];
  cssAttributes= [];
}
// 组件html解析
function componentRender(wrapCodeWithCard = true) {
  const renderer = new marked.Renderer()

  renderer.html = function (html:any) {
      let realHtml;
      // 解析 自定义脚本 标签
      [scriptContents, scriptAttributes, realHtml] = extractAndRemoveTagContent(html, 'vueScript');
      
      // 解析 自定义样式 标签
      [cssContents, cssAttributes, realHtml] = extractAndRemoveTagContent(realHtml, 'vueStyle')
      
      // 解析html中的出现的组件
      realHtml = parseHTMLComponents(realHtml)
      
      return realHtml
  }
  return renderer
}

// 解析html特殊标签
function extractAndRemoveTagContent(html: any, tagName: string) {
  const regex = new RegExp(`<${tagName}([^>]*)>[\\s\\S]*?<\\/${tagName}>`, 'g');
    const matches = html.match(regex);

    if (matches) {
        const extractedContents = [];
        const extractedAttributes = [];

        for (const match of matches) {
            const tagAttributesMatch = match.match(new RegExp(`<${tagName}([^>]*)>`));
            const tagAttributesString = tagAttributesMatch ? tagAttributesMatch[1] : '';
            const tagAttributes = extractTagContents(tagAttributesString);

            const content = match.replace(new RegExp(`<${tagName}[^>]*>|<\\/${tagName}>`, 'g'), '');
            extractedContents.push(content)
            extractedAttributes.push(tagAttributes);
        }

        const cleanedHtml = html.replace(regex, '');

        return [extractedContents, extractedAttributes, cleanedHtml];
    } else {
        return [[], [], html]
    }
}

// 解析标签属性
function extractTagContents(tagString: string) {
  const regex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/;
  const matches = tagString.match(regex);

  if (matches) {
    const [, tagName, attributes] = matches;

    return attributes;
  } else {
    return '';
  }
}

// 解析组件标签
function parseHTMLComponents(html:any) {
  // 获取html代码中出现的所有标签
  const regex = /<([^>\/\s]+)(?:\s+[^>]+)?>/g;
  const templateTags = html?.match(regex)?.map((tag:any) => {
      const tagRel = tag.replace(/[<>]/g, '')
      if(tagRel.includes(" ")) {
          return tagRel.split(" ")[0];
      }
      return tagRel
  }) || [];
  // 将出现的所有vue组件都存储到components中并去重
  components = [...new Set([...components, ...templateTags.filter((tag:any) => registerComponentNameList.includes(tag))])];
  return html
}

// 获取已注册的组件名称
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
  
  const baseCss = cssContents.map((item, index) => `
    <style ${cssAttributes[index]} >
    ${item}
    </style>
  `)
  let SFC = `
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
    ${baseCss}
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
