const pingHandler = require("./ping");
const echoHandler = require("./echo");
const setHandler = require("./set")
const getHandler = require("./get")
const deleteHandler = require("./delete")
const existsHandler = require("./exists")
const keysHandler = require("./keys")
const dbSizeHandler = require("./dbsize")
const expireHandler = require("./expire")
const ttlHandler = require("./ttl")
const pttlHandler = require("./pttl")
const pexpireHandler = require("./pexpire")
const persistHandler = require("./persist")


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
        arity: [2, 4]
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
    },
    EXPIRE: {
        handler: expireHandler,
        arity: [2, 2]
    },
    TTL: {
        handler: ttlHandler,
        arity: [1, 1]
    },
    PTTL: {
        handler: pttlHandler,
        arity: [1, 1]
    },
    PEXPIRE: {
        handler: pexpireHandler,
        arity: [2, 2]
    },
    PERSIST: {
        handler: persistHandler,
        arity: [1, 1]
    }
}

module.exports = commands