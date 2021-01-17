$("#chat-input").keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    
    if (keycode == "13"){
        window.main.connectionController.sendMessage($("#chat-input").val());
        $("#chat-input").val("");
    }
});