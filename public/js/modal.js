export default class ModalController {
    showLoadingModal(message) {
        $("#loading-modal").modal();
        $("#loading-modal").find(".modal-title").html(message);
    }   

    hideLoadingModal(delay=true) {
        function hide() {
            $("#loading-modal").modal("hide");
        }

        if (delay) {
            setTimeout(hide, 750);
        } else {
            hide();
        }
    }


    showLoginModal(callback) {
        $("#login-modal").modal();
        $("#login-modal button").click(() => {
            callback($("#login-modal input").val());
            $("#login-modal").modal("hide");
        });
    }
}