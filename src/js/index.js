// import '@babel/polyfill'; // 包含ES6的高级语法的转换
import '../css/iconfont.css';
import '../css/demo1.less';
import '../css/demo2.css';
import demo from './module1';
import { data } from './module2';

function add(x, y) {
  return x + y;
}

// eslint-disable-next-line
console.log(add(1, 2));
demo();
// eslint-disable-next-line
console.log(data);

const p = new Promise(() => {});
p.then();
