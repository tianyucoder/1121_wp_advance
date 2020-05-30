const express = require('express')

//创建一个服务器实例
const app = express()

app.use(express.static('./build',{maxAge:1000 * 3600}))

app.listen(4000,(err)=>{
	if(!err) console.log('服务器启动成功了，地址：http://localhost:4000');
})