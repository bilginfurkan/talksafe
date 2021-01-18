import ConnectionController from "./connection.js";
import EncryptionController from "./encryption.js";
import TemplateController from "./template.js";
import ModalController from "./modal.js";
import UserController from "./user.js";


class Main {
    connectionController;
    encryptionController;
    templateController;
    modalController;
    userController;

    constructor() {
        this.encryptionController = new EncryptionController();
        this.userController = new UserController();
        this.templateController = new TemplateController();
        this.modalController = new ModalController();

        if (this.userController.getUserData() === null) {
            this.modalController.showLoginModal((username) => {
                this.userController.setUserData(username);
                this.connect();
            })
        } else {
            this.connect();
        }
    }

    connect() {
        this.connectionController = new ConnectionController(this);
    }
}

window.main = new Main();