const net = require("net");
const { parseResp, encodeResp } = require("./resp")
const commands = require("./commands/index")
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
                    sendError(`ERR ${parsedReqRes.error}`)
                    return;
                }

                incomingBuffer = incomingBuffer.subarray(parsedReqRes.bytesConsumed);

                try {
                    const response = executeCommand(parsedReqRes.args);

                    if (response.type === "error") {
                        sendError(`ERR ${response.value}`, false)
                    } else {
                        sendSuccessfulResp(response)
                    }

                } catch (e) {
                    console.error("Command execution failed:", e);
                    sendError("ERR internal server error", false);
                }


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
        const commandName = args[0].toString("ascii").toUpperCase();
        const command = commands[commandName]
        if (!command) {
            return {
                type: "error",
                value: `unknown command '${commandName}'`
            }
        }
        const commandArgs = args.slice(1);

        if (commandArgs.length < command.arity[0] || commandArgs.length > command.arity[1]) {
            return {
                type: "error",
                value: `wrong number of arguments for '${commandName.toLowerCase()}' command`
            }
        }

        const response = command.handler(commandArgs)



        return response
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