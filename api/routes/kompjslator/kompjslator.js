'use strict';

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

//const upload = multer();
const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 10},
});

module.exports = async function (app) {
    const asAction = require('machine-as-action'); //machine to build the functions

    app.route('/kompjslator/lexicon')
        .post(upload.single('file'), (req, res, next) => {
            req.params.app = app;
            req.params.file_path = req.file.path;
            next();
        }, asAction(app.controllers.kompjslator.lexicon));
};
