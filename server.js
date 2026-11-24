const net = require("net");
const { parseResp, encodeResp } = require("./resp")
const PORT = 6379

const server = net.createServer((socket) => {
    let incomingBuffer = Buffer.alloc(0)
    let isProcessing = false;
    let isClosed = false;
    console.log("Client connected")

    socket.on("data", (data) => {
        if (isClosed) return;
        incomingBuffer = Buffer.concat([incomingBuffer, data])

        if (isProcessing) return;

        processBuffer()
    })

    const processBuffer = () => {
        isProcessing = true;
        try {
            while (true) {
                const parsedReqRes = parseResp(incomingBuffer)

                if (!parsedReqRes) break;

                if (parsedReqRes.error) {
                    sendError(parsedReqRes.error)
                    return;
                }

                const response = executeCommand(parsedReqRes.args);

                if (response.type === "error") {
                    sendError(response.value, false)
                } else {
                    sendSuccessfulResp(response)
                }

                incomingBuffer = incomingBuffer.subarray(parsedReqRes.bytesConsumed);
            }
        } catch (err) {
            console.error("Handler error:", err.message);
        } finally {
            isProcessing = false
        }
    }

    const sendError = (error, closeSocket = true) => {
        const encoded = encodeResp("error", error);
        if (closeSocket) {
            isClosed = true
            socket.end(encoded)
        } else {
            socket.write(encoded)
        }
    }

    const sendSuccessfulResp = (resp) => {
        const encoded = encodeResp(resp.type, resp.value);
        socket.write(encoded)
    }

    const executeCommand = (args) => {
        if (args.length === 0) return {
            type: "error",
            value: "empty command"
        }
        const command = args[0].toUpperCase();
        const commandArgs = args.slice(1);

        switch (command) {
            case "PING":
                if (commandArgs.length === 0) {
                    return {
                        type: "simpleString",
                        value: "PONG"
                    }
                } else if (commandArgs.length > 1) {
                    return {
                        type: "error",
                        value: "wrong number of arguments for 'ping' command"
                    }
                }
                return {
                    type: "bulkString",
                    value: commandArgs[0]
                }

            case "ECHO":
                if (commandArgs.length !== 1) {
                    return {
                        type: "error",
                        value: "wrong number of arguments for 'echo' command"
                    }
                }
                return {
                    type: "bulkString",
                    value: commandArgs[0]
                }

            default:
                return {
                    type: "error",
                    value: "unknown command"
                }
        }
    }

    socket.on("close", () => {
        isClosed = true
    })

    socket.on("error", (err) => {
        console.error("Socket error", err)
    })
})

if (require.main === module) {
    server.listen(PORT, "0.0.0.0", () => {
        console.log("Listening to port 6379")
    })
}

module.exports = server