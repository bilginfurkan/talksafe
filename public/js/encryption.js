function randomString(length) {
    var result           = "";
    var characters       = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const STORAGE_RSA_KEY = "rsaKey";

export default class EncryptionController {
    _keyCache;

    generateKey(passphrase=undefined) {
        if (passphrase === undefined) {
            passphrase = randomString(1024);
        }
        
        return new Key(cryptico.generateRSAKey(passphrase, 1500), passphrase); // RSA-1500 because, why not?
    }

    decrypt(text) {
        return cryptico.decrypt(text, this._keyCache.rsaKey);
    }

    getRSAKey() {
        if (!window.localStorage.getItem(STORAGE_RSA_KEY)) { // Generate public-private key pair if it doesn't exist
            this._keyCache = this.generateKey();
            window.localStorage.setItem(STORAGE_RSA_KEY, JSON.stringify(this._keyCache));

        } else if (this._keyCache === undefined) { // Load existing one
            this._keyCache = JSON.parse(window.localStorage.getItem(STORAGE_RSA_KEY));

            this._keyCache.rsaKey = cryptico.importRSAKey(this._keyCache.rsaKey);
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