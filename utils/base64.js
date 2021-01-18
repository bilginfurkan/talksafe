class Base64 {
    encode(str) {
        return Buffer.from(str).toString("base64");
    }

    encodeObject(obj) {
        return this.encode(JSON.stringify(obj));
    }
}

module.exports = new Base64();