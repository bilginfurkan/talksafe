class User {
    id;
    publicKey;
    socket;
    username;

    constructor(id, publicKey, socket) {
        this.id = id;
        this.publicKey = publicKey;
        this.socket = socket;
    }
}

const base64 = require("./utils/base64");
const cryptico = require("cryptico");
const connections = new Map();

function testPublicKey(publicKey) {
    let key = cryptico.encrypt("test", publicKey);

    return key.status === "success";
}

function init(io) {
    io.on("connection", (socket) => {
        let uniqueKey = socket.id;
        let user = new User(uniqueKey, undefined, socket);

        socket.on("init", (data) => {
            if (!testPublicKey(data.publicKey)) {
                console.log("Invalid public key, disconnecting.");
                socket.disconect(true);
                return;
            }

            user.username = data.userData.username;
            user.publicKey = data.publicKey;

            socket.emit("initDone");
        });
    
        socket.on("chat", (data) => {
            sendMessage(data, user);
        });

        socket.on("disconnect", () => {
            connections.delete(uniqueKey);
        });
        
        connections.set(uniqueKey, user);
    });
}

function sendMessage(data, user) {
    let str = data.content;

    if (str === undefined || str === "") {
        console.log("Invalid data");
        return;
    }

    for (const target of connections.values()) {
        let encryptedData = { 
            chat: str,
            username: user.username
        };

        encryptedData = cryptico.encrypt(base64.encodeObject(encryptedData), target.publicKey);
        
        if (encryptedData.status !== "success") { // Invalid public key
            continue;
        }

        target.socket.emit("chat", {
            encryptedData : encryptedData.cipher
        });
    }
}

module.exports = init;