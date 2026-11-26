const { dbSize } = require("../store")

const dbSizeHandler = () => {
    return {
        type: "integer",
        value: dbSize()
    }
}

module.exports = dbSizeHandler