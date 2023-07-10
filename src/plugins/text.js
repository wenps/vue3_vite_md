export default function printCode() {
  return {
    name: 'print-code',
    transform(code, id) {
      console.log(code, id);
       if (id.endsWith('.vue')) {
        console.log(`目标文件 ${id} 的代码：\n\n${code}`);
      }
    }
  };
};