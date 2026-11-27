const data = new Map();

const set = (key, value, expiry = null) => {
    let expiresAt = null;
    if (expiry) {
        if (expiry.unit === "ex") {
            expiresAt = Date.now() + expiry.value * 1000;
        } else if (expiry.unit === "px") {
            expiresAt = Date.now() + expiry.value;
        }
    }
    const valueObject = {
        type: "string",
        value,
        expiresAt: expiresAt
    }
    data.set(key, valueObject)
}

const get = (key) => {
    const validEntry = getValidEntry(key)
    return validEntry
}

const del = (key) => {
    return data.delete(key)
}

const exists = (key) => {
    const validEntry = getValidEntry(key);
    return validEntry ? true : false
}

const keys = () => {
    const validKeys = []
    for (const key of data.keys()) {
        if (getValidEntry(key)) {
            validKeys.push(key)
        }
    }
    return validKeys
}

const dbSize = () => {
    for (let key of data.keys()) {
        getValidEntry(key)
    }
    return data.size
}

const getValidEntry = (key) => {
    if (!data.has(key)) return null;
    const entry = data.get(key);

    if (entry.expiresAt !== null && Date.now() >= entry.expiresAt) {
        del(key);
        return null
    }

    return entry
}

const expire = (key, seconds) => {
    const validEntry = get(key);
    if (!validEntry) return 0
    validEntry.expiresAt = Date.now() + seconds * 1000
    return 1
}

const ttl = (key) => {
    const validEntry = get(key);
    if (!validEntry) return -2;
    if (validEntry.expiresAt === null) return -1;
    const remainingTime = validEntry.expiresAt - Date.now()
    return Math.floor(remainingTime / 1000)
}

const persist = (key) => {
    const validEntry = get(key);
    if (!validEntry || validEntry.expiresAt === null) return 0;
    validEntry.expiresAt = null;
    return 1
}

const pexpire = (key, milliseconds) => {
    const validEntry = get(key);
    if (!validEntry) return 0
    validEntry.expiresAt = Date.now() + milliseconds
    return 1
}

const pttl = (key) => {
    const validEntry = get(key);
    if (!validEntry) return -2;
    if (validEntry.expiresAt === null) return -1;
    const remainingTime = validEntry.expiresAt - Date.now()
    return remainingTime
}


module.exports = { set, get, del, exists, keys, dbSize, getValidEntry, expire, ttl, persist, pexpire, pttl }
