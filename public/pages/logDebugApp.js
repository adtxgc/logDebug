/**
 * @desc wap端使用，用来发送日志信息到服务端
 * @author adtxgc@hotmail.com
 * @Date 2017-8-20
 */

(function(win, obj) {
  var wsUrl = 'ws://127.0.0.1:3001', //websocket接口配置
    wsState = false, //websocket连接状态
    ws = null; //websocket实例

  var logD = (function() {
    /**
     * @desc 初始化websocket链接
     */
    function _initWS() {
      var id = _queryUrl('wsId');
      if (!id) {
        alert("请再URL中配置wsId参数！");
        return;
      }
      wsUrl += "?id=" + id + "&from=wap";
      ws = new WebSocket(wsUrl);
      ws.onopen = function(event) {
        if (event.target.readyState == 1) {
          wsState = true;
        }
      }
      ws.onclose = function(event) {
        console.dir(event);
      }
    }

    /**
     * @desc 日志记录
     * @arg {string} content 日志内容
     */
    function _log(content) {
      var str = content,
        index = 0;
      if (typeof content != 'string') {
        try {
          str = JSON.stringify(content);
        } catch (e) {
          alert("只能记录字符串内容！");
          return;
        }
      }
      index = setInterval(function() {
        if (wsState) {
          clearInterval(index);
          ws.send(str);
        }
      }, 50);
    }

    /**
     * @desc 获取url查询字符串中的值
     * @arg {string} str 查询字符串
     * @arg {string} ignore 是否忽略大小写
     * @return {string} 查询字符串值
     */
    function _queryUrl(str, ignore) {
      var t = '';
      var reg = ignore ? 'gi' : 'g';
      decodeURIComponent(window.location.search).toString().replace(
        new RegExp("[?&]" + str + "=[^&]+", reg),
        function(r) {
          var n = r.split('=')[1];
          n && (t = n);
        });
      return t;
    }
    /**
     * @desc 格式化时间字符串2017-02-23 17:25:56
     * @return {string} 格式化之后的时间字符串
     */
    function _formatTime() {
      var curTime = new Date(),
        year = curTime.getFullYear(),
        month = _addZero(curTime.getMonth() + 1 + ''),
        day = _addZero(curTime.getDate() + ''),
        hour = _addZero(curTime.getHours() + ''),
        minute = _addZero(curTime.getMinutes() + ''),
        second = _addZero(curTime.getSeconds() + '');

      return '' + year + '-' + month + '-' + day + ' ' + hour + ':' +
        minute + ':' + second;
    }
    /**
     * @desc 是否添加前缀0
     * @arg {string} num
     * @return {string}
     */
    function _addZero(num) {
      return num.length > 1 ? num : ('0' + num);
    }

    _initWS();

    return {
      info: function(content) {
        setTimeout(function() {
          var str = JSON.stringify({
            action: 'wapSave',
            content: '[' + _formatTime() + '] [INFO] #### ' +
              content
          })
          _log(str);
        }, 0);
      },
      error: function(content) {
        setTimeout(function() {
          var str = JSON.stringify({
            action: 'wapSave',
            content: '[' + _formatTime() + '] [ERROR] #### ' +
              content
          })
          _log(str);
        }, 0);
      }
    }
  }());
  win[obj] = logD;
}(window, 'logD'));
