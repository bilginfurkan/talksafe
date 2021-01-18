class UserData {
    username;
}

const STORAGE_USER_DATA = "userData";

export default class UserController {
    userData = null;

    constructor() {
        this.userData = JSON.parse(window.localStorage.getItem(STORAGE_USER_DATA));
    }

    getUserData() {
        return this.userData;
    }

    setUserData(username) {
        this.userData = new UserData();
        this.userData.username = username;

        this.save();
    }

    save() {
        window.localStorage.setItem(STORAGE_USER_DATA, JSON.stringify(this.getUserData()));
    }
}