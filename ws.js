const wsPath = require('./src/ws/wsPath.js');
const logCfg = require('./config.js');
const wsServer = require('ws').Server;
const queryString = require('querystring');

const wsS = new wsServer({
  port: logCfg.wsPort
});

/**
 * @desc 缓存websocket连接列表
 */
let wsMap = {};

wsS.on('connection', (ws, req) => {
  let queryObj = queryString.parse(req.url.split('?')[1]),
    id = queryObj.id,
    type = queryObj.from,
    temp = {};

  switch (type) {
    case 'web':
      temp.webWs = ws;
      break;
    case 'wap':
      temp.wapWs = ws;
      break;
  }

  if (!wsMap[id]) {
    temp.content = '';
    wsMap[id] = temp;
  } else {
    if (!!temp.webWs) {
      wsMap[id].webWs = temp.webWs;
    }
    if (!!temp.wapWs) {
      wsMap[id].wapWs = temp.wapWs;
    }
  }

  ws.on('message', (message) => {
    let msg = {},
      tempWs = wsMap[id];
    try {
      msg = JSON.parse(message);
    } catch (e) {

    }
    switch (msg.action) {
      case 'wapSave': //移动端保存日志发送到桌面浏览器中
        tempWs.content += msg.content + '\r\n';
        if (!!tempWs.webWs) {
          let str = JSON.stringify({
            action: 'getLog',
            content: msg.content
          });
          tempWs.webWs.send(str);
        }
        break;
      case 'webSave': //web端持久化日志
        wsPath.saveFile(id, tempWs.content, (state) => {
          let str = JSON.stringify({
            action: 'saveLogFile',
            content: state
          });
          tempWs.webWs.send(str);
          if (state == 'success') {
            //日志文件保存成功后，清空缓存
            tempWs.content = '';
          }
        });
        break;
    }
  });
});

console.log("websocket server starting……");
