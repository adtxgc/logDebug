let returnCode = (function() {
  return {
    SUCCESS: {
      code: '000000',
      desc: '成功'
    },
    NODIR: {
      code: '000001',
      desc: '目录不存在'
    },
    NOFILE: {
      code: '000002',
      desc: '文件不存在'
    },
    TRAVERSE: {
      code: '000003',
      desc: '遍历文件失败'
    }
  }
}());

module.exports = returnCode;
