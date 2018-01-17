const logCfg = require('../../config');
const returnCode = require('../utils/returnCode');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

//获取日志文件名列表
router.post('/get/name', (req, res) => {
  let params = req.body;
  let dirPath = path.join(logCfg.logPath, params.id);
  let msg = {};
  if (fs.existsSync(dirPath)) {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        msg = {
          returnCode: returnCode.TRAVERSE.code,
          desc: returnCode.TRAVERSE.desc
        }
      } else {
        msg = {
          returnCode: returnCode.SUCCESS.code,
          desc: returnCode.SUCCESS.desc,
          result: files
        }
        res.json(msg);
      }
    });
  } else {
    msg = {
      returnCode: returnCode.NODIR.code,
      desc: returnCode.NODIR.desc
    }
  }
});
//下载文件
router.get('/download/file', (req, res) => {
  let query = req.query;
  let fileName = decodeURI(query.fileName);
  let filePath = path.join(logCfg.logPath, query.id, fileName);
  if (fs.existsSync(filePath)) {
    res.download(filePath, fileName);
  } else {
    res.send(fileName + " not exists!");
  }
})

module.exports = router;
