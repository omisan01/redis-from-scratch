const { set } = require("../store");

const setHandler = (commandArgs) => {
    const key = commandArgs[0].toString("utf8");
    const val = commandArgs[1];
    if (commandArgs.length === 2) { set(key, val) }
    else if (commandArgs.length === 4) {
        const unit = commandArgs[2].toString("utf8").toLowerCase();
        const expiry = commandArgs[3].toString("utf8")
        if (unit === "px" || unit === "ex") {
            if (!/^\d+$/.test(expiry.trim())) {
                return {
                    type: "error",
                    value: "Expiry needs to be a valid number"
                }
            }

            if (Number(expiry) <= 0) {
                return {
                    type: "error",
                    value: "Expiry must be greater than zero"
                }
            }
            set(key, val, {
                unit,
                value: Number(expiry)
            })
        } else {
            return {
                type: "error",
                value: "Unsupported unit"
            }
        }
    } else {
        return {
            type: "error",
            value: "Invalid argument counts"
        }
    }

    return {
        type: "simpleString",
        value: "OK"
    }
}

module.exports = setHandler