import "./ui/send.js";

export default class TemplateController {
    templates = new Map();

    constructor() {
        this.addTemplates([
            "#incoming-message",
            "#outgoing-message"
        ]);
    }

    renderMessage(message, incoming=true) {
        let date = new Date();
        $("#message-list").append(
            this.getTemplate("#" + (incoming ? "incoming-message" : "outgoing-message")).render(
                {
                    message: message.chat,
                    username: message.username,
                    date: "tarih..."
                }
            )
        )
    }

    addTemplates(arr) {
        for (const item of arr) {
            this.addTemplate(item);
        }
    }

    getTemplate(name) {
        return this.templates.get(name);
    }

    addTemplate(name) {
        this.templates.set(name, $.templates(name));
    }
}