
const net = require("net");
const test = require("node:test");
const assert = require("node:assert/strict");

function sendRequest(input) {
    return new Promise((resolve, reject) => {
        const client = net.createConnection({
            host: "127.0.0.1",
            port: 6379
        });

        let response = Buffer.alloc(0);

        client.on("connect", () => {
            client.write(input);
        });

        client.on("data", (data) => {
            response = Buffer.concat([response, data]);
        });

        client.on("end", () => {
            resolve(response.toString());
        });

        client.on("error", reject);
    });
}

test("rejects invalid array length", async () => {
    const response = await sendRequest("*abc\r\n");
    assert.match(response, /^-ERR /);
});

test("rejects invalid bulk string prefix", async () => {
    const response = await sendRequest("*1\r\n+4\r\n");
    assert.match(response, /^-ERR /);
});

test("rejects invalid bulk string terminator", async () => {
    const response = await sendRequest("*1\r\n$4\r\nPINGXX");
    assert.match(response, /^-ERR /);
});

test("rejects arrays exceeding size limit", async () => {
    const response = await sendRequest("*1025\r\n");
    assert.match(response, /^-ERR /);
});

test("rejects bulk strings exceeding size limit", async () => {
    const response = await sendRequest("*1\r\n$1048577\r\n");
    assert.match(response, /^-ERR /);
});
