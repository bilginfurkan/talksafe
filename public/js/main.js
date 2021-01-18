import ConnectionController from "./connection.js";
import EncryptionController from "./encryption.js";
import TemplateController from "./template.js";
import ModalController from "./modal.js";

class Main {
    connectionController;
    encryptionController;
    templateController;
    modalController;

    constructor() {
        this.encryptionController = new EncryptionController();
        this.templateController = new TemplateController();
        this.modalController = new ModalController();
        this.connectionController = new ConnectionController(this);
    }
}

window.main = new Main();