const fs = require("fs")
const path = require("path")
const generateDevelopers = require('./generateDevelopers.js');
module.exports = function env() {
  const developers = generateDevelopers()
  fs.writeFileSync(
    path.resolve(__dirname, "../../.env"),
    `REACT_APP_DEVELOPERS=${developers}`,
    "utf8"
  )
}
