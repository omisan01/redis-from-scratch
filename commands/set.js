const { set } = require("../store");

const setHandler = (commandArgs) => {
    const key = commandArgs[0].toString("utf8");

    set(key, commandArgs[1])

    return {
        type: "simpleString",
        value: "OK"
    }
}

module.exports = setHandler