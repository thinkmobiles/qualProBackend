define(function () {
    var getData = function (url, data, callback) {
        $.get(url, data, function (response) {
            callback(null, response);
        }).fail(function (jxhr) {
            callback(jxhr);
        });
    };
    var postData = function (url, data, callback) {
        $.ajax({
            url: url,
            data: data,
            type: 'POST',
            success: function (response) {
                callback(null, response)
            },
            error: function (jxhr) {
                callback(jxhr)
            }
        });
    };

    return {
        getData: getData,
        postData: postData
    }

});
