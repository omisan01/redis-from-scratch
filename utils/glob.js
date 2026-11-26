const globMatch = (pattern, key) => {
    let starIndex = -1;
    let matchIndex = 0;
    let i = 0;
    let j = 0;
    while (j < key.length) {
        if (pattern[i] === "*") {
            starIndex = i;
            matchIndex = j;
            i++
            continue
        }

        if (pattern[i] === "?") {
            i++;
            j++;
            continue;
        }

        if (pattern[i] === '\\') {
            const escapedChar = pattern[i + 1] ?? "\\";
            if (key[j] === escapedChar) {
                i += pattern[i + 1] === undefined ? 1 : 2;
                j++
                continue
            }

            if (starIndex !== -1) {
                i = starIndex + 1;
                matchIndex++;
                j = matchIndex;
                continue;
            }

            return false;
        }

        if (pattern[i] === "[") {
            const closingBracket = pattern.indexOf("]", i + 1);
            if (closingBracket === -1) return false;
            const chars = pattern.slice(i + 1, closingBracket)
            const matches = matchesCharacterSet(chars, key[j])
            if (matches) {
                i = closingBracket + 1;
                j++;
                continue
            }

            if (starIndex !== -1) {
                i = starIndex + 1;
                matchIndex++;
                j = matchIndex;
                continue;
            }

            return false;
        }

        if (pattern[i] === key[j]) {
            i++;
            j++;
            continue
        }

        if (starIndex !== -1) {
            i = starIndex + 1;
            matchIndex++;
            j = matchIndex;
            continue
        }

        return false
    }
    while (pattern[i] === "*") {
        i++;
    }

    return i === pattern.length;
}

const matchesCharacterSet = (chars, character) => {
    let matches = false;
    let negated = false
    if (chars[0] === "^") {
        negated = true
        chars = chars.slice(1)
    }

    for (let i = 0; i < chars.length; i++) {
        if (chars[i] === "-" && i > 0 && i < chars.length - 1) {
            const start = chars[i - 1];
            const end = chars[i + 1];

            const lower = Math.min(start.charCodeAt(0), end.charCodeAt(0))
            const upper = Math.max(start.charCodeAt(0), end.charCodeAt(0))

            const value = character.charCodeAt(0);


            if (value >= lower && value <= upper) {
                matches = true;
                break;
            }

            i++;
            continue;
        }

        if (chars[i] === character) {
            matches = true;
            break;
        }
    }

    return negated ? !matches : matches
}

module.exports = globMatch
