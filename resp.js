const MAX_LINE_LENGTH = 64;

const parseResp = (buffer) => {
    if (buffer.length === 0) return null;
    if (buffer[0] !== 42) return { error: "Protocol Error" }

    const firstCRLF = buffer.indexOf(`\r\n`)

    if (firstCRLF === -1) {
        if (buffer.length > MAX_LINE_LENGTH) {
            return { error: "Protocol error: line exceeds maximum length" };
        } else {
            return null
        }
    }
    if (firstCRLF > MAX_LINE_LENGTH) return { error: "Max line length limit reached" }

    const bytes = buffer.subarray(0, firstCRLF);

    const header = bytes.toString("ascii");

    const length = extractArrayLen(header);

    if (length === null) return null;

    if (length.error) { return { error: length.error } }

    const args = [];
    let offset = firstCRLF + 2;
    for (let i = 0; i < length; i++) {
        const extractedRes = extractBulkString(buffer, offset)
        if (!extractedRes) return null;

        if (extractedRes.error) return { error: extractedRes.error }
        args.push(extractedRes.payload);
        offset = extractedRes.bytesConsumed + offset
    }

    return {
        args,
        bytesConsumed: offset
    }

}

const extractArrayLen = (header) => {
    if (!header.startsWith("*")) return null;

    const length = header.slice(1)

    if (validateLength(length)) {
        return { error: "Not a valid length" }
    }

    if (Number(length) > 1024) {
        return { error: "Array length exceeds limit" };
    }

    return Number(length)

}

const extractBulkString = (buffer, offset) => {
    if (offset >= buffer.length) {
        return null;
    }
    if (buffer[offset] === 36) {
        const nextCRLF = buffer.indexOf("\r\n", offset);
        if (nextCRLF === -1) {
            if (buffer.length - offset > MAX_LINE_LENGTH) {
                return { error: "Protocol error: line exceeds maximum length" };
            } else {
                return null
            }
        }
        if (nextCRLF - offset > MAX_LINE_LENGTH) return { error: "Max line length limit reached" }
        const lengthBytes = buffer.subarray(offset + 1, nextCRLF);
        const length = lengthBytes.toString("ascii")

        if (validateLength(length)) return { error: "Protocol Error" }

        if (Number(length) > 1024 * 1024) {
            return { error: "Bulk String Length exceeds limit" };
        }

        const payloadStart = nextCRLF + 2;
        const payloadEnd = payloadStart + Number(length);

        if (buffer.length < payloadEnd + 2) return null;
        const payload = buffer.subarray(payloadStart, payloadEnd)

        if (buffer[payloadEnd] !== 13 || buffer[payloadEnd + 1] !== 10) return { error: "Protocol error" }

        return {
            payload,
            bytesConsumed: payloadEnd + 2 - offset
        }

    } else {
        return { error: "Protocol Error" }
    }
}

const validateLength = (length) => {
    return !/^\d+$/.test(length)
}

const encodeResp = (type, value) => {
    let val = Buffer.alloc(0)
    switch (type) {
        case "simpleString":
            val = Buffer.from(`+${value}\r\n`)
            break;

        case "bulkString":
            const convertedVal = Buffer.isBuffer(value)
                ? value
                : Buffer.from(value, "utf8");
            const length = convertedVal.byteLength;
            val = Buffer.concat([Buffer.from(`$${length}\r\n`),
                convertedVal,
            Buffer.from("\r\n")])
            break;

        case "integer":
            if (typeof (value) !== "number" || !Number.isSafeInteger(value)) {
                throw new TypeError("Invalid RESP integer");
            }
            val = Buffer.from(`:${value}\r\n`)
            break;

        case "array":
            const encodedElements = value.map(item =>
                encodeResp("bulkString", item)
            );

            val = Buffer.concat([
                Buffer.from(`*${value.length}\r\n`),
                ...encodedElements
            ]);
            break;

        case "nullBulkString":
            val = Buffer.from("$-1\r\n");
            break;

        case "error":
            val = Buffer.from(`-${value}\r\n`)
            break

        default:
            throw new TypeError("Unsupported RESP response type");
    }

    return val
}

module.exports = { parseResp, encodeResp }

