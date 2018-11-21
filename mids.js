const config = require('./config');
module.exports = {
    auth: function (mode, accessMode, direction) {
        return function (req, res, next) {
            if (mode === 1) {
                let isAuth = false;
                let comparison = true;
                let redirectTo;
                let allowedAccess;
                switch (accessMode) {
                    case 'bo':
                        allowedAccess = config.access.bo;
                        redirectTo = '/bo/masuk';
                        break;
                    case 'fo':
                        allowedAccess = config.access.fo;
                        redirectTo = '/fo/masuk';
                        break;
                    default:
                        allowedAccess = [accessMode];
                        redirectTo = '/?accessMode=' + accessMode;
                        break;
                }
                if (direction === 'inverse') {
                    comparison = false;
                    switch (accessMode) {
                        case 'bo':
                            redirectTo = '/bo';
                            break;
                        case 'fo':
                            redirectTo = '/fo';
                            break;
                        default:
                            redirectTo = '/?accessMode=' + accessMode;
                            break;
                    }
                }
                if (req.session.uMasuk && req.session.uMasuk === true) {
                    if (req.session.uAkses && allowedAccess.indexOf(req.session.uAkses) > -1) {
                        isAuth = true;
                    }
                }
                if (isAuth === comparison) {
                    next();
                } else {
                    res.redirect(redirectTo);
                }
            }
        }
    },
    reqInit: function () {
        return function (req, res, next) {
            let ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
            req.ipAddress = ip;
            next();
        }
    }
};