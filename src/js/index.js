import '../css/iconfont.css';
import '../css/demo1.less';
import '../css/demo2.css';
import { add, sub } from './module1';
import { data, msg } from './module2';

// eslint-disable-next-line
console.log(add(1, 1));
// eslint-disable-next-line
console.log(sub(5, 3));
// eslint-disable-next-line
console.log(data, msg);

// 注册serviceWorker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.log('sw注册成功了~');
      })
      .catch(() => {
        console.log('sw注册失败了~');
      });
  });
}

document.getElementById('btn').onclick = () => {
  import(/* webpackChunkName: 'test' */'./test').then(
    ({ test1 }) => { test1(); },
  ).catch(
    (error) => { console.log(error); },
  );
};

/* if (module.hot) {
  // 若module.hot 为true，说明开启了HMR功能
  module.hot.accept('./module1.js', () => {
    // accept方法会监听 module1.js 文件的变化，
    // 一旦发生变化，会执行后面的回调函数,其他模块不会重新打包构建。
    // eslint-disable-next-line
		console.log(add(1, 1));
    // eslint-disable-next-line
		console.log(sub(5, 1));
  });
} */
