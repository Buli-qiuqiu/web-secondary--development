let achievement = [
  {
    "审计科研稿件题目": {
      lable: "题目111",
      value: "题目111"
    },
    "优秀科研成果类别": {
      lable: "1",
      value: "1"
    },
    "人员角色": {
      lable: "1",
      value: "1"
    },
    "刊载媒体": "测试",
    "作者人数": 3,
    "刊载情况截图": [
      {
        "name": "1.png",
        "uid": "rc-upload-1677486625247-4",
        "url": "/storage_area/form/1234567890/dee77a7c1b8949b4878e4a930ab90dfe.png"
      }
    ],
    "刊载情况附件": [
      {
        "url": "/storage_area/form/1234567890/d735c68c8c2f47ea8fc8b1f99cc79e99.docx",
        "name": "2023年度青年干部成长档案.docx"
      }
    ],
    "刊载日期": 1677427200000
  },
  {
    "审计科研稿件题目": "题目222",
    "优秀科研成果类别": {
      lable: "1",
      value: "1"
    },
    "人员角色": {
      lable: "0",
      value: "0"
    },
    "刊载媒体": "测试",
    "作者人数": 4,
    "刊载情况截图": null,
    "刊载情况附件": [],
    "刊载日期": null
  },
  {
    "审计科研稿件题目": "题目111",
    "优秀科研成果类别": {
      lable: "3",
      value: "3"
    },
    "人员角色": {
      lable: "1",
      value: "1"
    },
    "刊载媒体": "测试",
    "作者人数": 22,
    "刊载情况截图": null,
    "刊载情况附件": [],
    "刊载日期": null
  },
  {
    "审计科研稿件题目": "题目222",
    "优秀科研成果类别": {
      lable: "3",
      value: "3"
    },
    "人员角色": {
      lable: "0",
      value: "0"
    },
    "刊载媒体": "测试",
    "作者人数": 222,
    "刊载情况截图": null,
    "刊载情况附件": [],
    "刊载日期": null
  },
  {
    "审计科研稿件题目": "题目222",
    "优秀科研成果类别": {
      lable: "2",
      value: "2"
    },
    "人员角色": {
      lable: "1",
      value: "1"
    },
    "刊载媒体": "测试",
    "作者人数": 222,
    "刊载情况截图": null,
    "刊载情况附件": [],
    "刊载日期": null
  },
  {
    "审计科研稿件题目": "222",
    "优秀科研成果类别": {
      lable: "2",
      value: "2"
    },
    "人员角色": {
      lable: "0",
      value: "0"
    },
    "刊载媒体": "测试",
    "作者人数": 2222,
    "刊载情况截图": null,
    "刊载情况附件": [],
    "刊载日期": 1677427200000
  }
]
let testArray = JSON.parse(JSON.stringify(achievement));
// console.log('$achievement', $achievement);
// let testArray = JSON.parse(JSON.stringify($achievement));


let oneArray = [],twoArray = [],threeArray = [],resArray = [];

testArray.forEach(element => {
  let { value } = element.优秀科研成果类别;
  switch (value) {
    case '1':
      oneArray.push(element)
      break;
    case '2':
      twoArray.push(element)
      break;
    case '3':
      threeArray.push(element)
      break;
  }
});

function filtrateTest(paramsArray) {
  if (paramsArray.length > 1) {
    const keyWord = paramsArray[0].人员角色['value'];
    let res = paramsArray.filter( x => {
      let { value } = x.人员角色;
      return value == keyWord;
    })
    resArray = resArray.concat(res);
  }else {
    resArray = resArray.concat(paramsArray);
  }
}

for (let index = 0; index < 3; index++) {
  switch (index) {
    case 0:
      filtrateTest(oneArray);
      break;
    case 1:
      filtrateTest(twoArray);
      break;
    case 2:
      filtrateTest(threeArray);
      break;
  }
}
console.log(resArray);
return resArray;


