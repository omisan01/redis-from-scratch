const { keys } = require("../store");
const globMatch = require("../utils/glob")

const keysHandler = (commandArgs) => {
    const pattern = commandArgs[0].toString("utf8")
    const allKeys = keys();

    const matchedKeys = allKeys.filter((key) => globMatch(pattern, key))
    return {
        type: "array",
        value: matchedKeys
    }
}

module.exports = keysHandler