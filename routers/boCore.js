const express = require('express');
const router = express.Router();
const config = require('../config');
const db = require('../db');
const helpers = require('../helpers');
const mids = require('../mids');
const bcrypt = require('bcrypt');
router.get('/init', mids.reqInit(), function (req, res) {
    // bcrypt.hash('admin', 11, function (error, hashResult) {
    //     db.User.bulkCreate([
    //         {nama: 'Publik'},
    //         {nama: 'Sistem', username: 'sistem', password: hashResult},
    //         {nama: 'Administrator', username: 'admin', password: hashResult}
    //     ]);
    // });
    res.send('Sukses.');
});
router.get('/', mids.reqInit(), mids.auth(1, 'bo'), function (req, res) {
    let data = {
        title: 'Dashboard',
        session: req.session,
        helpers: helpers
    };
    res.render('bo/dashboard', {data: data});
});
router.get('/masuk', mids.reqInit(), mids.auth(1, 'bo', 'inverse'), function (req, res) {
    let data = {
        title: 'Masuk',
        session: req.session,
        helpers: helpers
    };
    res.render('bo/masuk', {data: data});
});
router.post('/masuk', mids.reqInit(), function (req, res) {
    let username = helpers.inputFilter(req.body.username);
    let password = helpers.inputFilter(req.body.password);
    let allowedAccess = config.access.bo;
    if (username && password) {
        db.User.findOne({
            where: {
                username: username
            }
        }).then(dataUser => {
            if (dataUser) {
                bcrypt.compare(password, dataUser.password, function (error, compareResult) {
                    if (compareResult === true) {
                        if (dataUser.status === 'aktif') {
                            if (allowedAccess.indexOf(dataUser.akses) > -1) {
                                req.session.uMasuk = true;
                                req.session.uId = dataUser.id;
                                req.session.uNama = dataUser.nama;
                                req.session.uAkses = dataUser.akses;
                                req.session.uUsername = dataUser.username;
                                req.session.save(function () {
                                    dataUser.password = null;
                                    helpers.addLog(req.ipAddress, dataUser.id, 'masuk', 'sukses');
                                    res.json(helpers.jsonResultGenerator(true, 0, dataUser));
                                });
                            } else {
                                res.json(helpers.jsonResultGenerator(false, 5));
                            }
                        } else {
                            res.json(helpers.jsonResultGenerator(false, 4));
                        }
                    } else {
                        res.json(helpers.jsonResultGenerator(false, 4));
                    }
                });
            } else {
                res.json(helpers.jsonResultGenerator(false, 4));
            }
        }).catch(error => {
            console.log(error);
        });
    } else {
        res.json(helpers.jsonResultGenerator(false, 2));
    }
});
module.exports = router;