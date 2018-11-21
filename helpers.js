const config = require('./config');
const i18n = require('i18n');
const db = require('./db');
module.exports = {
    addLog: function (ipAddress, idUser, aktivitas, status, dataTerdampak, keterangan) {
        let data = {
            ipAddress: ipAddress,
            idUser: idUser,
            aktivitas: aktivitas,
            status: status,
            dataTerdampak: dataTerdampak,
            keterangan: keterangan
        };
        db.Log.create(data).then(dataLog => {
            console.log('Log ID: ' + dataLog.id + ', at: ' + dataLog.createdAt);
        }).catch(error => {
            console.log('Logging error: ' + error);
        });
    },
    inputFilter: function (stringVal) {
        return stringVal;
    },
    jsonResultGenerator: function (status, code, data) {
        let result = {
            resultStatus: status,
            resultCode: code,
            resultMsg: this.msgTranslator(code),
            data: data
        };
        return result;
    },
    msgTranslator: function (code) {
        return i18n.__('msg' + code + '');
    }
};