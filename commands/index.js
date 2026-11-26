const pingHandler = require("./ping");
const echoHandler = require("./echo");
const setHandler = require("./set")
const getHandler = require("./get")
const deleteHandler = require("./delete")
const existsHandler = require("./exists")
const keysHandler = require("./keys")
const dbSizeHandler = require("./dbsize")

const commands = {
    PING: {
        handler: pingHandler,
        arity: [0, 1]
    },
    ECHO: {
        handler: echoHandler,
        arity: [1, 1]
    },
    SET: {
        handler: setHandler,
        arity: [2, 2]
    },
    GET: {
        handler: getHandler,
        arity: [1, 1]
    },
    DEL: {
        handler: deleteHandler,
        arity: [1, 1]
    },
    EXISTS: {
        handler: existsHandler,
        arity: [1, 1]
    },
    KEYS: {
        handler: keysHandler,
        arity: [1, 1]
    },
    DBSIZE: {
        handler: dbSizeHandler,
        arity: [0, 0]
    }
}

module.exports = commands