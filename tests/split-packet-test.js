
const net = require("net");

const client = net.createConnection({
    host: "127.0.0.1",
    port: 6379
});

let received = Buffer.alloc(0);

client.on("connect", () => {
    console.log("Connected to Mini Redis");

    // First chunk: only the array header
    client.write("*1\r\n");

    console.log("Sent first chunk: *1\\r\\n");

    // Send the remaining bytes after a short delay
    setTimeout(() => {
        client.write("$4\r\nPING\r\n");
        console.log("Sent second chunk: $4\\r\\nPING\\r\\n");
    }, 100);
});

client.on("data", (data) => {
    received = Buffer.concat([received, data]);

    console.log("Received:", JSON.stringify(received.toString()));

    if (received.toString().includes("+PONG\r\n")) {
        console.log("\nSplit packet test passed.");
        client.end();
    }
});

client.on("error", (err) => {
    console.error("Client error:", err.message);
});

client.on("close", () => {
    console.log("Connection closed");
});
