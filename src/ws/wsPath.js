const logCfg = require('../../config.js');
const fs = require('fs');
const path = require('path');

let wsPath = (function() {
  /**
   * @desc 格式化时间字符串2017-02-23 17：25：56
   * @return {string} 格式化之后的时间字符串
   */
  function _formatTime() {
    let curTime = new Date(),
      year = curTime.getFullYear(),
      month = _addZero(curTime.getMonth() + 1 + ''),
      day = _addZero(curTime.getDate() + ''),
      hour = _addZero(curTime.getHours() + ''),
      minute = _addZero(curTime.getMinutes() + ''),
      second = _addZero(curTime.getSeconds() + '');

    return '' + year + '-' + month + '-' + day + ' ' + hour + '：' +
      minute + '：' + second;
  }
  /**
   * @desc 是否添加前缀0
   * @arg {string} num
   * @return {string}
   */
  function _addZero(num) {
    return num.length > 1 ? num : ('0' + num);
  }

  return {
    saveFile: function(dirName, content, fn) {
      let dirPath = path.join(logCfg.logPath, dirName);
      let filePath = path.join(dirPath, _formatTime() + '.txt');

      if (fs.existsSync(dirPath)) {
        fs.writeFile(filePath, content, (err) => {
          if (err) {
            console.dir(err);
            typeof fn == 'function' && fn('error');
            return;
          }
          typeof fn == 'function' && fn('success');
        });
      } else {
        fs.mkdir(dirPath, (err) => {
          if (err) {
            console.dir(err);
            typeof fn == 'function' && fn('error');
            return;
          }
          fs.writeFile(filePath, content, (err) => {
            if (err) {
              console.dir(err);
              typeof fn == 'function' && fn('error');
              return;
            }
            typeof fn == 'function' && fn('success');
          });
        });
      }
    }
  }
}());


module.exports = wsPath;
