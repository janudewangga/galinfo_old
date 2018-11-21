function redirect(url) {
    return window.location.href = url;
}

function setMsg(mode, code, msgMode, message) {
    let result = '';
    switch (mode) {
        case 1:
            $('.' + code).remove();
            result = '<div class="alert alert-' + msgMode + ' ' + code + ' fade in">' + message + ' <button class="close" aria-label="Close" data-dismiss="alert" type="button"><span aria-hidden="true">&times;</span></button></div>';
            break;
    }
    return result;
}