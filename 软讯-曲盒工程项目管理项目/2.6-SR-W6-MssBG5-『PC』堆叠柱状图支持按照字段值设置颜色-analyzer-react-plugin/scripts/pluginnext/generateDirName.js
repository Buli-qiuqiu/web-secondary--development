const fs = require("fs")
const path = require("path")
const configJson = require("../../pluginTemp/config.json")
const chalk = require("chalk")
const information = require("../information.json")
module.exports = function generateDirName() {

  const pluginType = configJson.type == "app"
    ? configJson.props.type == "customize" ? "app" : configJson.props.type
    : configJson.type
  const isVue = fs.readdirSync(path.resolve(__dirname, "../")).some((item) => {
    item == "vue.config.js"
  })
  const firstDate = information.firstDate
  //生成文件夹名称
  const requirementNumber = configJson["requirement-number"]
  const requirementName = configJson["requirement-name"]
  const warning = requirementNumber == "需求编号" || requirementName == "需求名称"
  warning && console.log(chalk.red("warning：\n请将pluginTemp目录下的config.json的requirement-number和requirement-name字段补充完整\n"))
  const dirName = `${firstDate}-${requirementNumber}-${requirementName}-${pluginType}-${isVue ? "vue" : "react"}-plugin`
  console.log(chalk.blue("建议文件夹名："))
  console.log(chalk.blue(dirName))

}
