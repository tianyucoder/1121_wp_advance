import '../css/iconfont.css';
import '../css/demo1.less';
import '../css/demo2.css';
import { add, sub } from './module1';
import { data, msg } from './module2';

// eslint-disable-next-line
console.log(add(1, 1));
// eslint-disable-next-line
console.log(sub(5, 1));
// eslint-disable-next-line
console.log(data, msg);

if(module.hot){
	//若module.hot 为true，说明开启了HMR功能
	module.hot.accept('./module1.js', () => {
		//accept方法会监听 module1.js 文件的变化，
		//一旦发生变化，会执行后面的回调函数,其他模块不会重新打包构建。
		// eslint-disable-next-line
		console.log(add(1, 1));
		// eslint-disable-next-line
		console.log(sub(5, 1));
	});
}
