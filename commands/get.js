const { get } = require("../store")

const getHandler = (commandArgs) => {
    const key = commandArgs[0].toString("utf8")
    const valueObject = get(key)

    if (!valueObject) {
        return {
            type: "nullBulkString"
        }
    }

    return {
        type: "bulkString",
        value: valueObject.value
    }
}

module.exports = getHandler