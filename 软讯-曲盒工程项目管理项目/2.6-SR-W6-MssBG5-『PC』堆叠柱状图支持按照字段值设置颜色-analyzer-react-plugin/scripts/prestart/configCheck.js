const configJson = require("../../pluginTemp/config.json")
const chalk = require("chalk")
module.exports = function configCheck() {
  const requirementNumber = configJson["requirement-number"]
  const requirementName = configJson["requirement-name"]
  const warning = requirementNumber == "需求编号" || requirementName == "需求名称"
  warning && console.log(chalk.red("warning：\n请将pluginTemp目录下的config.json的requirement-number和requirement-name字段补充完整\n"))
}
