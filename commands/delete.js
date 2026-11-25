const { del } = require("../store");

const deleteHandler = (commandArgs) => {
    const key = commandArgs[0].toString("utf8");

    return {
        type: "integer",
        value: del(key) ? 1 : 0
    }
}

module.exports = deleteHandler