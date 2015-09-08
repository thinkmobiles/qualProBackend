var fs = require('fs');
var path = require('path');
var async = require('async');

var LocalFs = function () {
    var defaultFileDir = process.env.FOLDER_NAME || 'attachments';

    this.getFileUrl = function (folderName, fileName, options, callback) {

        if (validateIncomingParameters(arguments)) {
            callback = arguments[arguments.length - 1];
        }

        var fileUrl = getFilePath(folderName, fileName);

        if (callback) {
            callback(null, fileUrl);
        }
    };

    function getFilePath(folderName, fileName) {
        var folder = folderName || defaultFileDir;

        return path.join(defaultPublicDir, folder, fileName);
    };

    this.postFile = function (folderName, fileData, callback) {
        var targetPath = path.join(defaultFileDir, folderName);
        var filePath;

        if(!(fileData instanceof Array)){
            fileData = [fileData];
        }

        async.each(fileData, function(item, eachCb){
            filePath = path.join(defaultFileDir, folderName, item.name);

            if (fs.existsSync(targetPath)) {
                writeFile(filePath, fileData, eachCb);
            } else {
                makeDir(targetPath, function (err) {
                    if (err) {
                        eachCb(err);
                    } else {
                        writeFile(filePath, fileData, eachCb);
                    }
                });
            }
        }, callback);
    };

    function makeDir(p, opts, f, made) {
        if (typeof opts === 'function') {
            f = opts;
            opts = {};
        } else if (!opts || typeof opts !== 'object') {
            opts = {mode: opts};
        }

        var mode = opts.mode;
        var xfs = opts.fs || fs;

        if (!made) {
            made = null;
        }

        var cb = f || function () {

            };

        p = path.resolve(p);

        xfs.mkdir(p, mode, function (er) {
            if (!er) {
                made = made || p;
                return cb(null, made);
            }

            switch (er.code) {
                case 'ENOENT':
                    makeDir(path.dirname(p), opts, function (er, made) {
                        if (er) cb(er, made);
                        else makeDir(p, opts, cb, made);
                    });
                    break;

                // In the case of any other error, just see if there's a dir
                // there already.  If so, then hooray!  If not, then something
                // is borked.
                default:
                    xfs.stat(p, function (er2, stat) {
                        // if the stat fails, then that's super weird.
                        // let the original error be the failure reason.
                        if (er2 || !stat.isDirectory()) {
                            cb(er, made)
                        } else {
                            cb(null, made);
                        }
                    });
                    break;
            }
        });
    };

    function writeFile(filePath, fileData, callback) {
        try {
            fs.writeFile(filePath, fileData, function (err, data) {
                if (callback && typeof callback === 'function') {
                    callback(err)
                }
            });
        }
        catch (err) {
            console.log('ERROR:', err);

            if (callback && typeof callback === 'function') {
                callback(err)
            }
        }
    };

    this.removeFile = function (folderName, fileName, options, callback) {
        if (self.validateIncomingParameters(arguments)) {
            callback = arguments[arguments.length - 1];
        }

        var imagePath = path.join(defaultPublicDir, folderName, fileName);

        fs.unlink(imagePath, function (err) {
            if (callback) {
                callback(err);
            }
        });
    };
};

module.exports = LocalFs;
