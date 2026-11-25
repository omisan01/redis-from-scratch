const pingHandler = require("./ping");
const echoHandler = require("./echo");

const commands = {
    PING: {
        handler: pingHandler,
        arity: [0, 1]
    },
    ECHO: {
        handler: echoHandler,
        arity: [1, 1]
    }
}

module.exports = commands