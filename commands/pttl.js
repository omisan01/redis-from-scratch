const { pttl } = require("../store");

const pttlHandler = (commandArgs) => {
    const key = commandArgs[0].toString("utf8");

    return {
        type: "integer",
        value: pttl(key)
    }
}

module.exports = pttlHandler