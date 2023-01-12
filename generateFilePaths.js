const fs = require('fs');
const path = require('path');

fs.readdir(__dirname,(err,data) => {
  if (err) {
    console.log("文件解析出错");
    return
  }
  data.forEach((dir) => {


  })
  
})