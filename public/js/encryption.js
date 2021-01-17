function randomString(length) {
    var result           = "";
    var characters       = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const STORAGE_PASSPHRASE = "keyPassphrase";

export default class EncryptionController {
    _keyCache;

    constructor() {
        this.getRSAKey();
    }

    generateKey(passphrase=undefined) {
        if (passphrase === undefined) {
            passphrase = randomString(1024);
        }
        
        return new Key(cryptico.generateRSAKey(passphrase, 1024), passphrase);
    }

    decrypt(text) {
        return cryptico.decrypt(text, this._keyCache.rsaKey);
    }

    getRSAKey() {
        if (!window.localStorage.getItem(STORAGE_PASSPHRASE)) {
            this._keyCache = this.generateKey();
            window.localStorage.setItem(STORAGE_PASSPHRASE, this._keyCache.passphrase);
        } else if (this._keyCache === undefined) {
            this._keyCache = this.generateKey(window.localStorage.getItem(STORAGE_PASSPHRASE));
        }

        return this._keyCache.rsaKey;
    }

    getPublicKey() {
        return cryptico.publicKeyString(this.getRSAKey());
    }
}

class Key {
    rsaKey;
    passphrase;

    constructor(rsaKey, passphrase) {
        this.rsaKey = rsaKey;
        this.passphrase = passphrase;
    }
}