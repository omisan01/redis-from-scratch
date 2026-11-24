const parseResp = (buffer) => {
    const firstCRLF = buffer.indexOf(`\r\n`)

    if (firstCRLF === -1) return null;

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
        args.push(extractedRes.decodedPayload);
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
    if (buffer[offset] === 36) {
        const nextCRLF = buffer.indexOf("\r\n", offset);
        if (nextCRLF === -1) return null
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
        const decodedPayload = payload.toString('utf8')

        return {
            decodedPayload,
            bytesConsumed: payloadEnd + 2 - offset
        }

    } else {
        return { error: "Protocol Error" }
    }
}

const validateLength = (length) => {
    return !/^\d+$/.test(length)
}

module.exports = { parseResp }
