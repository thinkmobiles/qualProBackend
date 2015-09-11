define(function () {


    /**
     *
     * @param url Represent url that data service will use to get data
     * @param {Object} data Additional parameters of request. Data will be represented as query string
     * @param {cb} callback function.
     */
    var getData = function (url, data, callback) {
        $.get(url, data, function (response) {
            callback(null, response);
        }).fail(function (jxhr) {
            callback(jxhr);
        });
    };

    /**
     *
     * @param {string} url Represent url that data service will use to post data
     * @param {Object} data Data to post
     * @param {cb} callback function
     */
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
