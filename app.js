const webRouter = require('./src/router/webRouter.js');
const logCfg = require('./config.js');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

//托管静态资源
app.use(express.static('public'));

//首页
app.get('/', (req, res) => {
  fs.readFile(path.join(path.resolve(),
    'public/index.html'), {
    encoding: 'utf-8'
  }, (err, data) => {
    if (!!err) {
      res.send('获取页面出错！');
    }
    res.send(data);
  });
});


//解析json格式的post请求参数
app.use('/log', bodyParser.json());

app.use('/log', webRouter);

const server = app.listen(logCfg.httpPort, () => {
  console.log("http server starting……");
});
