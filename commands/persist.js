const { persist } = require("../store");

const persistHandler = (commandArgs) => {
    const key = commandArgs[0].toString("utf8");

    return {
        type: "integer",
        value: persist(key)
    }
}

module.exports = persistHandler