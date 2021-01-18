function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}
function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
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
            data = b64DecodeUnicode(this.main.encryptionController.decrypt(data).plaintext);
            
            this.main.templateController.renderMessage(data, true);
        });
    }

    sendInit() {
        this.socket.emit("init", { 
            publicKey: this.main.encryptionController.getPublicKey() 
        });
    }

    sendMessage(message) {
        message = b64EncodeUnicode(message);
        this.socket.emit("chat", {
            content: message
        })
    }
}