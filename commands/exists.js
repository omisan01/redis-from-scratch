const { exists } = require("../store");

const existsHandler = (commandArgs) => {
    const key = commandArgs[0].toString("utf8");

    return {
        type: "integer",
        value: exists(key) ? 1 : 0
    }
}

module.exports = existsHandler