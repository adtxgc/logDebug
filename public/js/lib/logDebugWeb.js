/**
 * @desc web端使用，用来接收服务端发送的日志记录
 * @author adtxgc@hotmail.com
 * @Date 2017-8-20
 */

(function(win, obj) {
  var wsUrl = 'ws://127.0.0.1:3001', //websocket接口配置
    wsState = false, //websocket连接状态
    fnMap = {}, //回调函数列表，获取服务端反馈消息
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
      wsUrl += "?id=" + id + "&from=web";
      ws = new WebSocket(wsUrl);
      ws.onopen = function(event) {
        if (event.target.readyState == 1) {
          wsState = true;
        }
      }
      ws.onmessage = function(event) {
        var msg = {};
        try {
          msg = JSON.parse(event.data);
        } catch (e) {
          alert("服务端发送消息格式不正确！");
        }
        switch (msg.action) {
          case 'getLog':
            if (!!fnMap.getLogFn && typeof fnMap.getLogFn == 'function') {
              fnMap.getLogFn(msg.content);
            }
            break;
          case 'saveLogFile':
            if (!!fnMap.saveLogFileFn && typeof fnMap.saveLogFileFn ==
              'function') {
              fnMap.saveLogFileFn(msg.content);
            }
            break;
        }
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

    _initWS();

    return {
      /**
       * @desc 获取服务端发送的日志信息
       * @arg {function} fn 通过回调函数获取移动端日志信息
       */
      getLog: function(fn) {
        fnMap.getLogFn = fn;
      },
      /**
       * @desc 本地化存储日志文件
       * @arg {function} fn 通过回调函数获取日志文件本地化存储是否成功
       */
      saveLogFile: function(fn) {
        fnMap.saveLogFileFn = fn;
        setTimeout(function() {
          var str = JSON.stringify({
            action: 'webSave'
          });
          _log(str);
        }, 0);
      }
    }
  }());
  win[obj] = logD;
}(window, 'logD'));
