import $ from 'jquery';

console.log($);

// 暴露加的函数
export function add(a, b) {
  return a + b + 5;
}
// 暴露减的函数
export function sub(a, b) {
  return a - b;
}
