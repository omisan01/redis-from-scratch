const { ttl } = require("../store");

const ttlHandler = (commandArgs) => {
    const key = commandArgs[0].toString("utf8");

    return {
        type: "integer",
        value: ttl(key)
    }
}

module.exports = ttlHandler