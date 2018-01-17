$(function() {
  var contentDiv = $("#content"),
    logFileDiv = $("#logFile"),
    saveFlag = false;


  var documentHeight = document.documentElement.offsetHeight;
  contentDiv.css('height', documentHeight + 'px');
  logFileDiv.css('height', (documentHeight - 160) + 'px');

  logD.getLog(function(data) {
    if (!contentDiv.find('p:first').length) {
      if (data.indexOf('ERROR') > -1) {
        contentDiv.html('<p style="color:#CC3300;">' + data + '</p>');
      } else {
        contentDiv.html('<p>' + data + '</p>');
      }
    } else {
      if (data.indexOf('ERROR') > -1) {
        $('<p style="color:#CC3300;">' + data + '</p>').insertBefore(
          contentDiv.find('p:first'));
      } else {
        $('<p>' + data + '</p>').insertBefore(contentDiv.find('p:first'));
      }
    }
  });

  $("#saveLog").click(function() {
    if (!$.trim(contentDiv.html())) {
      alert("不能保存空日志文件");
      return;
    }
    if (saveFlag) return;
    saveFlag = true;
    logD.saveLogFile(function(state) {
      saveFlag = false;
      if (state == 'success') {
        alert("保存成功");
        contentDiv.empty();
        getLogFiles();
      } else {
        alert("保存失败");
      }
    });
  });

  /**
   * @desc 获取保存的日志文件列表
   */
  function getLogFiles() {
    $.ajax({
      url: CFG.getLogNameUrl,
      type: 'post',
      data: JSON.stringify({
        id: _queryUrl('wsId')
      }),
      contentType: 'application/json',
      dataType: 'JSON',
      error: function(data) {
        alert("接口请求失败！");
      },
      success: function(data) {
        var _data = data;
        if (typeof data == 'string') {
          _data = JSON.parse(data);
        }
        if (_data.returnCode == '000000') {
          initLogFiles(_data.result);
        } else {
          alert("接口请求异常！");
        }
      }
    });
  }
  /**
   * @desc 渲染日志文件名称列表
   * @arg {array} logNameList 日志文件名称列表
   */
  function initLogFiles(logNameList) {
    var count = logNameList && logNameList.length,
      url = CFG.downloadLogFileUrl + '?id=' +
      _queryUrl('wsId'),
      html = '';
    for (var i = count - 1; i > 0; i--) {
      html += '<a href="' + url + '&fileName=' +
        encodeURI(logNameList[i]) + '">' +
        logNameList[i] + '</a>';
    }
    $("#logFile").html(html);
  }
  /**
   * @desc 获取url查询字符串中的值
   * @arg {string} str 查询字符串
   * @arg {string} ignore 是否忽略大小写
   * @return {string} 查询字符串值
   */
  function _queryUrl(str, ignore) {
    var reg = ignore ? 'gi' : 'g',
      t = '';
    decodeURIComponent(window.location.search).toString().replace(
      new RegExp("[?&]" + str + "=[^&]+", reg),
      function(r) {
        var n = r.split('=')[1];
        n && (t = n);
      });
    return t;
  }
});
