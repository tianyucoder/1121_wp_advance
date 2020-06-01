import $ from 'jquery';

console.log($);

/* import('./test').then(
  (result) => { console.log(result); },
).catch(
  (err) => { console.log(err); },
); */

const data = 'hello,atguigu';
const msg = 'hello,1121';
// 统一暴露
export { data, msg };
