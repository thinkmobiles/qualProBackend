var fs = require('fs');
var path = require('path');

var LocalFs = function () {

    var defaultPublicDir = 'public';
    var defaultFileDir = process.env.FOLDER_NAME || 'uploads';

    function validateIncomingParameters(args) {
        var argumentsLength = args.length;
        var isCallback;
        var callback = args[4];
        var options = args[3];
        switch (argumentsLength) {
            case 4:
                isCallback = typeof callback === 'function';
                break;
            case 3:
                isCallback = typeof options === 'function';
                if (isCallback) {
                    callback = options;
                    options = defaultOptions;
                }
                break;
            case 2:
                options = defaultOptions;
                break;
            default:
                console.error('Not enough incoming parameters');

                return false;
        }
        ;
        return isCallback;
    };

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

    this.postFile = function (folderName, fileName, options, callback) {
        if (validateIncomingParameters(arguments)) {
            callback = arguments[arguments.length - 1];
        }

        var targetPath = path.join(defaultPublicDir, folderName);
        var filePath = path.join(defaultPublicDir, folderName, fileName);

        if (fs.existsSync(targetPath)) {
            writeFile(filePath, options.data, callback);
        } else {
            makeDir(targetPath, function (err) {
                if (err) {
                    if (callback) {
                        callback(err);
                    } else {
                        console.error('Make dir error ' + err.message);
                    }
                } else {
                    writeFile(filePath, options.data, callback);
                }
            });
        }
    };

    //used from mkdirp //copied from https://www.reasoncoresecurity.com/index.js-aac43011740bff785368c2a80bc05dacab5e1dd2.aspx
    function makeDir(p, opts, f, made) {
        if (typeof opts === 'function') {
            f = opts;
            opts = {};
        } else if (!opts || typeof opts !== 'object') {
            opts = {mode: opts};
        }

        var mode = opts.mode;
        var xfs = opts.fs || fs;

        /*if (mode === undefined) {
         mode = 0777 & (~process.umask());
         }*/

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
