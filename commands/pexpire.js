const { pexpire } = require("../store");

const pexpireHandler = (commandArgs) => {
    const key = commandArgs[0].toString("utf8");
    const expiry = commandArgs[1].toString("utf8")

    if (!/^\d+$/.test(expiry.trim())) {
        return {
            type: "error",
            value: "Expiry needs to be a valid number"
        }
    }

    const response = pexpire(key, Number(expiry))
    return {
        type: "integer",
        value: response
    }
}

module.exports = pexpireHandler