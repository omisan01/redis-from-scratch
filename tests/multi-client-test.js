
const net = require("net");

function createClient(name, command, expected) {
    return new Promise((resolve, reject) => {
        const client = net.createConnection({
            host: "127.0.0.1",
            port: 6379
        });

        let received = Buffer.alloc(0);

        client.on("connect", () => {
            console.log(`${name} connected`);
            client.write(command);
        });

        client.on("data", (data) => {
            received = Buffer.concat([received, data]);

            if (received.toString().includes(expected)) {
                console.log(`${name} received:`, JSON.stringify(received.toString()));
                client.end();
            }
        });

        client.on("close", () => {
            if (received.toString().includes(expected)) {
                resolve();
            } else {
                reject(new Error(`${name} received an unexpected response`));
            }
        });

        client.on("error", reject);
    });
}

async function runTest() {
    try {
        await Promise.all([
            createClient(
                "Client A",
                "*1\r\n$4\r\nPING\r\n",
                "+PONG\r\n"
            ),
            createClient(
                "Client B",
                "*2\r\n$4\r\nECHO\r\n$5\r\nworld\r\n",
                "$5\r\nworld\r\n"
            )
        ]);

        console.log("\nMultiple clients test passed.");
    } catch (error) {
        console.error("Test failed:", error.message);
        process.exitCode = 1;
    }
}

runTest();
