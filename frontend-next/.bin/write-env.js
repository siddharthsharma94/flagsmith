const fs = require('fs')
const path = require("path")
fs.writeFileSync(path.join(__dirname,"../env"), `ADMIN_USERNAME="${process.env.ADMIN_USERNAME}"
ADMIN_PASSWORD="${process.env.ADMIN_PASSWORD}"
`)
