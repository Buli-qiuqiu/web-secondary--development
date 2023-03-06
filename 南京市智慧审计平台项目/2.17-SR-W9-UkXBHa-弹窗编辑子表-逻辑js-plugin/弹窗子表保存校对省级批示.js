let achievement = [
  {
    "信息宣传稿件题目": {
      lable: "题目111",
      value: "题目111"
    },
    "领导批示类别": {
      lable: "0",
      value: "0"
    },
    "领导批示内容": "",
    "领导批示日期": null,
    "作者人数": 33,
    "领导批示截图": null,
    "领导批示附件": [],
    "自评分": 0.9090909090909091
  },
  {
    "信息宣传稿件题目": {
      lable: "题目111",
      value: "题目111"
    },
    "领导批示类别": {
      lable: "1",
      value: "1"
    },
    "领导批示内容": "",
    "领导批示日期": null,
    "作者人数": 333,
    "领导批示截图": null,
    "领导批示附件": [],
    "自评分": 0.15015015015015015
  },
  {
    "信息宣传稿件题目": {
      lable: "题目222",
      value: "题目222"
    },
    "领导批示类别": {
      lable: "2",
      value: "2"
    },
    "领导批示内容": "",
    "领导批示日期": null,
    "作者人数": 333,
    "领导批示截图": null,
    "领导批示附件": [],
    "自评分": 0.24024024024024024
  },
  {
    "信息宣传稿件题目": {
      lable: "题目111",
      value: "题目111"
    },
    "领导批示类别": {
      lable: "2",
      value: "2"
    },
    "领导批示内容": "",
    "领导批示日期": null,
    "作者人数": 333,
    "领导批示截图": null,
    "领导批示附件": [],
    "自评分": 0.24024024024024024
  },
  {
    "信息宣传稿件题目": {
      lable: "题目222",
      value: "题目222"
    },
    "领导批示类别": {
      lable: "2",
      value: "2"
    },
    "领导批示内容": "",
    "领导批示日期": null,
    "作者人数": 333,
    "领导批示截图": null,
    "领导批示附件": [],
    "自评分": 0.15015015015015015
  }
]

if (achievement.length < 2) return false;
let testArray = JSON.parse(JSON.stringify(achievement));
// console.log('$achievement', $achievement);
// let testArray = JSON.parse(JSON.stringify($achievement));
// if ($achievement.length < 2) return $achievement;

let titleArray = [], typeArray = [], indexNum = null, resArray = [];

testArray.forEach(element => {
  let { value } = element.信息宣传稿件题目;
  if (titleArray.includes(value) == false) {
    titleArray.push(value);
    typeArray.push([]);
  }
  indexNum = titleArray.indexOf(value);
  typeArray[indexNum].push(element)
});

typeArray.forEach(x=>{
  let mostExpPilot = x.reduce(function (oldest, pilot) {
    let { value } = pilot.领导批示类别;
    return (oldest?.领导批示类别?.value || 0) > value ? oldest : pilot;
  }, {});
  resArray.push(mostExpPilot)
})
console.log('resArray', resArray);
return resArray;

