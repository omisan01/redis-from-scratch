const echoHandler = (commandArgs) => {
    return {
        type: "bulkString",
        value: commandArgs[0]
    }
}

module.exports = echoHandler