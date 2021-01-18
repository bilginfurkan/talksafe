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
}