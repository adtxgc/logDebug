$(function() {
  $("#infoSend").click(function() {
    var str = $("#info").val();
    logD.info(str);
  });
  $("#errorSend").click(function() {
    var str = $("#error").val();
    logD.error(str);
  });
})
