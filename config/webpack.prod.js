/*
  webpack生产环境配置:
    1.运行指令：npm run build 或 yarn build。
		2.生产环境配置特点：生成本地最终文件，要部署在服务器上运行
		3.主要完成功能：
			(1).处理less资源
			(2).处理css资源
			(3).处理图片资源(base64转码)
			(4).处理量html中图片资源
			(5).处理其他资源(字体等)
			(6).提取css为单独文件
			(7).css兼容性处理
			(8).压缩css
			(9).js语法检查
			(10).js兼容性处理(按需引入)
			(11).压缩html、js文件
*/

//从Node内置path模块中引入resolve，用于解析路径
const { resolve } = require('path');
//引入html-webpack-plugin，用于打包html资源
const HtmlWebpackPlugin = require('html-webpack-plugin');
//引入mini-css-extract-plugin，用于提取css为单独文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//引入optimize-css-assets-webpack-plugin压缩css
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

// 定义nodejs环境变量：决定使用browserslist的哪个环境,不写就是production环境
//process.env.NODE_ENV = 'development';

// 配置一个commonCssLoader，处理less和css时都会使用
const commonCssLoader = [
  MiniCssExtractPlugin.loader, //提取css为单独的文件
  'css-loader', //将css文件变成commonjs模块加载js中，里面内容是样式字符串
  {
    //注意：想让postcss-loader工作，还需在package.json中定义browserslist配置兼容程度
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [require('postcss-preset-env')()]
    }
  }
];

//向外暴露一个webpack配置
module.exports = {
	/* 
	mode选项用于配置webpack的工作模式，可选值：development、production，二选一。
		1.development是开发模式，webpack不压缩js，不压缩html
		2.production是生产模式，webpack会帮助我们压缩js，压缩html
	*/
	mode: 'production', //开发模式
	
	//入口文件：告诉webpack从哪里作为入口构建依赖图
	entry: './src/js/index.js',

	//输出：告诉webpack将加工之后的文件放在哪里--开发环境不需要有输出
  output: {
    filename: 'js/built.js', //输出文件名
		path: resolve(__dirname, '../build'), //输出路径
		publicPath:'/' //项目根路径，根据实际情况自行调整
	},

	//配置loader
  module: {
    rules: [
      //每个对象为一个loader配置
      {
        // 处理css资源
        test: /\.css$/,
        use: [...commonCssLoader]
			},
			{
        // 处理less资源
        test: /\.less$/,
        use: [...commonCssLoader, 'less-loader']
			},
			{
        // 对js进行语法检查，在package.json中eslintConfig --> airbnb
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true//自动修复
        }
			},
			/*
        js兼容性处理：babel-loader @babel/core 
          1. 基本js兼容性处理 --> @babel/preset-env
            		问题：只能转换基本语法，如promise高级语法不能转换
          2. 全部js兼容性处理 --> @babel/polyfill  
            		问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
          3. 需要做兼容性处理的就做：按需加载  --> core-js
      */
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									useBuiltIns: 'usage',  // 按需引入(需要使用polyfill)
									corejs: { version: 3 }, // 解决warning警告
									targets: { // 指定兼容性处理哪些浏览器
										"chrome": "58",
										"ie": "9",
									}
								}
							]
						],
						cacheDirectory: true, // 开启babel缓存
					}
				}
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
					outputPath: 'imgs', //输出路径
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
		//处理html中<img>标签
    new HtmlWebpackPlugin({
			template: './src/index.html', //生成的新html的模板位置
			minify: false //此处插件配置为无需压缩html，因为当webpack的工作模式为production时，会自动压缩html
		}),
		//压缩css
		new OptimizeCssAssetsWebpackPlugin(),
		//提取css为单独文件
		new MiniCssExtractPlugin({
      // 对输出的css文件进行重命名
			filename: 'css/built.css',
    })
	],
};
