import ConnectionController from "./connection.js";
import EncryptionController from "./encryption.js";
import TemplateController from "./template.js";

class Main {
    connectionController;
    encryptionController;
    templateController;

    constructor() {
        this.connectionController = new ConnectionController(this);
        this.encryptionController = new EncryptionController();
        this.templateController = new TemplateController();
    }
}

window.main = new Main();