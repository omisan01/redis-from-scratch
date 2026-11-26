const data = new Map();

const set = (key, value) => {
    const valueObject = {
        type: "string",
        value,
        expiresAt: null
    }
    data.set(key, valueObject)
}

const get = (key) => {
    if (data.has(key)) {
        return data.get(key)
    }
    return null
}

const del = (key) => {
    return data.delete(key)
}

const exists = (key) => {
    return data.has(key)
}

const keys = () => {
    return Array.from(data.keys())
}

const dbSize = () => {
    return data.size
}

module.exports = { set, get, del, exists, keys, dbSize }
