const clean = (value) => {
    if (Array.isArray(value)) return value.map(clean);
    if (value && typeof value === "object") {
        const out = {};
        for (const [key, val] of Object.entries(value)) {
            if (key.startsWith("$") || key.includes(".")) continue; // drop operators
            out[key] = clean(val);
        }
        return out;
    }
    return value;
};

export const sanitize = (req, res, next) => {
    if (req.body) req.body = clean(req.body);
    next();
};