
const net = require("net");

const client = net.createConnection({
    host: "127.0.0.1",
    port: 6379
});

let received = Buffer.alloc(0);

client.on("connect", () => {
    console.log("Connected to Mini Redis");

    // Two RESP commands sent in a single TCP write
    const commands =
        "*1\r\n$4\r\nPING\r\n" +
        "*2\r\n$4\r\nECHO\r\n$5\r\nhello\r\n";

    client.write(commands);
});

client.on("data", (data) => {
    received = Buffer.concat([received, data]);

    console.log("Received:", JSON.stringify(received.toString()));

    // Both responses received
    if (received.toString().includes("hello\r\n")) {
        console.log("\nPipelining test completed.");
        client.end();
    }
});

client.on("error", (err) => {
    console.error("Client error:", err.message);
});
