function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

function b64EncodeUnicodeObject(obj) {
    return b64EncodeUnicode(JSON.stringify(obj));
}

function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function b64DecodeUnicodeObject(str) {
    return JSON.parse(b64DecodeUnicode(str));
}

export default class ConnectionController {
    socket;
    main;

    constructor(main) {
        this.main = main;

        this.socket = io();
        this.registerEvents();

        this.main.modalController.showLoadingModal("Sunucuya bağlanılıyor...");
    }

    registerEvents() {
        this.socket.on("connect", () => {
            this.main.modalController.showLoadingModal("Şifreleniyor...");
            setTimeout(() => {
                this.sendInit();
                this.main.modalController.hideLoadingModal();
            }, 200);
        });

        this.socket.on("chat", (data) => {
            data = data.encryptedData;
            data = this.main.encryptionController.decrypt(data).plaintext;
            data = b64DecodeUnicodeObject(data);

            console.log(data);

            let isIncoming = data.username !== this.main.userController.getUserData().username;

            this.main.templateController.renderMessage(data, isIncoming);
        });
    }

    sendInit() {
        this.emit("init", { 
            publicKey: this.main.encryptionController.getPublicKey(),
            userData: this.main.userController.getUserData()
        });
    }

    sendMessage(message) {
        this.emit("chat", {
            content: message
        });
    }

    emit(category, message) {
        this.socket.emit(category, message); // WIP
    }
}