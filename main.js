class User {
    id;
    publicKey;
    socket;
    name;

    constructor(id, publicKey, socket) {
        this.id = id;
        this.publicKey = publicKey;
        this.socket = socket;
    }
}

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

        connections.set(uniqueKey, user);
    
        socket.on("init", (data) => {
            if (!testPublicKey(data.publicKey)) {
                console.log("Invalid public key, disconnecting.");
                socket.disconect(true);
                return;
            }

            user.name = data.name;
            user.publicKey = data.publicKey;

            socket.emit("initDone");
        });
    
        socket.on("chat", (data) => {
            sendMessage(data);
        });

        socket.on("disconnect", () => {
            connections.delete(uniqueKey);
        });
    });
}

function sendMessage(data) {
    let str = data.content;

    if (str === undefined || str === "") {
        console.log("Invalid data");
        return;
    }

    for (const user of connections.values()) {
        let encryptedData = str;
        encryptedData = cryptico.encrypt(encryptedData, user.publicKey);
        
        if (encryptedData.status !== "success") {
            console.log("Invalid public key");
            continue;
        }

        user.socket.emit("chat", {
            encryptedData : encryptedData.cipher
        });
    }
}

module.exports = init;