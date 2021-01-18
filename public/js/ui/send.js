$(document).ready(() => {
    function send() {
        window.main.connectionController.sendMessage($("#chat-input").val());
        $("#chat-input").val("");
    }

    $("#chat-input").keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        
        if (keycode == "13"){
            send();
        }
    });

    $("#message-send-button").click(() => {
        send();
    });
})