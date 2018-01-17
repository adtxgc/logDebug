process.env.lx = 'dev'; //'dev' 开发环境；'test' 测试环境；'pro' 开发环境

let logCfg = {};

switch (process.env.lx) {
  case 'dev':
    logCfg = {
      logPath: 'D:/NodeProject/logDebug',
      httpPort: '3000',
      wsPort: '3001'
    }
    break;
  case 'test':
    break;
  case 'pro':
    break;
}

module.exports = logCfg;
