const pingHandler = (commandArgs) => {
    if (commandArgs.length === 0) {
        return {
            type: "simpleString",
            value: "PONG"
        }
    }
    return {
        type: "bulkString",
        value: commandArgs[0]
    }
}

module.exports = pingHandler