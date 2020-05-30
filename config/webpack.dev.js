/*
  webpack开发环境配置:
    1.运行指令：npm run dev 或 yarn dev。
		2.开发环境配置特点：只会在内存中编译打包，没有输出到本地硬盘。
		3.主要完成功能：
			(1).处理less资源
			(2).处理css资源
			(3).处理图片资源(base64转码)
			(4).处理html中图片资源
			(5).处理其他资源(字体等)
*/

//从Node内置path模块中引入resolve，用于解析路径
const { resolve } = require('path');
//引入html-webpack-plugin，用于打包html资源
const HtmlWebpackPlugin = require('html-webpack-plugin');

//向外暴露一个webpack配置
module.exports = {
	/* 
		mode选项用于配置webpack的工作模式，可选值：development、production，二选一。
			1.development是开发模式，webpack不压缩js，不压缩html
			2.production是生产模式，webpack会帮助我们压缩js，压缩html
	 */
	mode: 'development', //开发模式
	
	//入口文件：告诉webpack从哪里作为入口构建依赖图
	entry: ['./src/js/index.js','./src/index.html'],

	//输出：告诉webpack将加工之后的文件放在哪里
  output: {
    filename: 'js/built.js', //输出文件名
    path: resolve(__dirname, 'build') //输出路径
	},

	//配置loader
  module: {
    rules: [
      //每个对象为一个loader配置
      {
        // 处理less资源
        test: /\.less$/,
        use: [
					'style-loader', //创建style标签，将js中的样式资源插入进行，添加到head中生效
					'css-loader', //将css文件变成commonjs模块加载js中，里面内容是样式字符串
					'less-loader' //将less文件编译成css文件
				]
      },
      {
        // 处理css资源
				test: /\.css$/,
				// use数组中loader执行顺序：从右到左，从下到上 依次执行
        use: [
          // 创建style标签，将js中的样式资源插入进行，添加到head中生效
          'style-loader',
          // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
          'css-loader'
        ]
      },
      {
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader', //url-loader是对file-loader的上层封装
        options: {
          limit: 8 * 1024, //临界值为8KB，小于8KB的图片会被转为base64编码
          name: '[hash:10].[ext]', //加工后图片的名字
          // 关闭es6模块化
          esModule: false, //防止html中<img>变为[object,Object]的问题
          outputPath: 'imgs' //输出路径
        }
      },
      {
        // 处理html中<img>资源
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        // 处理其他资源(字体、音视频等等)
        exclude: /\.(html|js|css|less|jpg|png|gif)/, //排除哪些文件
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]', //命名
          outputPath: 'media' //输出路径
        }
      }
    ]
	},

	//配置plugins
  plugins: [
    // plugins的配置
    new HtmlWebpackPlugin({
      template: './src/index.html' //生成的新html的模板位置
    })
	],

	//devServer配置(开发模式所特有的配置)
  devServer: {
    contentBase: resolve(__dirname, 'build'),//本地打包文件的位置
    compress: true, //启用gzip压缩
    port: 3000, //端口号
		open: true, //自动打开浏览器
		hot:true
  }
};
