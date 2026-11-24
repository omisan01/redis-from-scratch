const net = require("net");
const { parseResp } = require("./resp")
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
        if (closeSocket) {
            isClosed = true
            socket.end(`-ERR ${error}\r\n`)
        } else {
            socket.write(`-ERR ${error}\r\n`)
        }
    }

    const sendSuccessfulResp = (resp) => {
        socket.write(`+${resp.value}\r\n`)
    }

    const executeCommand = (args) => {
        if (args.length === 0) return {
            type: "error",
            value: "empty command"
        }
        const command = args[0].toUpperCase();
        if (command === "PING") {
            return {
                type: "simpleString",
                value: "PONG"
            }
        } else {
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
    server.listen(PORT, "localhost", () => {
        console.log("Listening to port 6379")
    })
}

module.exports = server