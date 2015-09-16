/**
 * @namespace App
 * @type {{file: {MAXSIZE: number, MaxFileSizeDisplay: string}, requestedURL: null, savedFilters: {}}}
 */

var App = App ||
    {
        file: {
            MAXSIZE: 10485760,  //size in kilobytes  = 3 MB
            MaxFileSizeDisplay: "10 MB"
        },
        requestedURL: null,
        savedFilters: {}
    };

require.config({
    paths: {
        async: './libs/async/lib/async',
        jQuery: './libs/jquery/dist/jquery.min',
        //ajaxForm: './libs/jquery-ajax-form/jquery-ajax-form',
        imageCrop: './libs/Jcrop/js/jquery.Jcrop.min',
        jqueryui: './libs/jquery-ui/jquery-ui.min',
        Underscore: './libs/underscore/underscore-min',
        Backbone: './libs/backbone/backbone-min',
        templates: '../templates',
        text: './libs/requirejs-text/text',
        helpers: 'helpers',
        constants: 'constants',
        d3: './libs/d3/d3.min',
        moment: './libs/moment/moment'
    },
    shim: {
        'jqueryui': ['jQuery'],
        //'ajaxForm': ['jQuery'],
        'imageCrop': ['jQuery'],
        'Backbone': ['Underscore', 'jQuery'],
        'app': ['Backbone', 'jqueryui', /*'ajaxForm',*/ 'imageCrop'],
        'd3': {
            exports: 'd3'
        }
    }
});

require(['app'], function (app) {
    App.errorContainer = $('#errorHandler');

    /**
     *
     * @param data
     * @instance
     */

    App.render = function (data) {
        var container = this.errorContainer;
        var messageClass = data.type || 'error';
        var text = data.message || 'Something went wrong';
        var renderEl = '<div class="animate ' + messageClass + '">' + text + '</div>';

        container.append(renderEl);

        container.find('div.animate').delay(10).animate({
            left: "85%",
            opacity: 1
        }, 500, function () {
            var self = $(this);

            self.removeClass('animate').delay(5000).animate({
                left: "100%",
                opacity: 0
            }, 1000, function () {
                self.remove();
            });
        });
    };

    Backbone.View.prototype.deleteRender = function (deleteCounter, deletePage, dataObject) {
        this.startTime = new Date();
        $("#top-bar-deleteBtn").hide();
        var itemsNumber = parseInt($("#itemsNumber").text());
        var pageNumber;
        if (deleteCounter === this.collectionLength) {
            pageNumber = Math.ceil(this.listLength / itemsNumber);
            if (deletePage > 1) {
                deletePage = deletePage - 1;
            }
            if ((deletePage == 1) && (pageNumber > 1)) {
                deletePage = 1;
            }
            if (((deletePage == 1) && (pageNumber == 0)) || (deletePage == 0)) {
                deletePage = 0;
            }

            if (deletePage == 0) {
                $("#gridStart").text(0);
                $("#gridEnd").text(0);
                $("#gridCount").text(0);
                $("#previousPage").prop("disabled", true);
                $("#nextPage").prop("disabled", true);
                $("#currentShowPage").val(0);
                $("#lastPage").text(0);
                $("#pageList").empty();
                $("#listTable").empty();
                $("#startLetter .current").removeClass("current").addClass("empty");
            } else {
                $("#gridStart").text((deletePage - 1) * itemsNumber + 1);
                //page counter Vasya
                var gridEnd = deletePage * itemsNumber;
                if (this.listLength <= gridEnd) {
                    $("#gridEnd").text(this.listLength);
                } else {
                    $("#gridEnd").text(gridEnd);
                }
                //end
                $("#gridCount").text(this.listLength);
                $("#currentShowPage").val(deletePage);
                $("#pageList").empty();

                for (var i = 1; i <= pageNumber; i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
                $("#lastPage").text(pageNumber);

                if (deletePage <= 1) {
                    $("#previousPage").prop("disabled", true);
                    $("#nextPage").prop("disabled", false);
                    $("#firstShowPage").prop("disabled", true);
                    $("#lastShowPage").prop("disabled", false);
                }
                if (deletePage >= pageNumber) {
                    $("#nextPage").prop("disabled", true);
                    $("#previousPage").prop("disabled", false);
                    $("#firstShowPage").prop("disabled", false);
                    $("#lastShowPage").prop("disabled", true);
                }
                if ((1 < deletePage) && (deletePage < pageNumber)) {
                    $("#nextPage").prop("disabled", false);
                    $("#previousPage").prop("disabled", false);
                    $("#firstShowPage").prop("disabled", false);
                    $("#lastShowPage").prop("disabled", false);
                }
                if ((deletePage == pageNumber) && (pageNumber == 1)) {
                    $("#previousPage").prop("disabled", true);
                    $("#nextPage").prop("disabled", true);
                    $("#firstShowPage").prop("disabled", true);
                    $("#lastShowPage").prop("disabled", true);
                }
                var serchObject = {
                    count: itemsNumber,
                    page: deletePage
                };
                if (dataObject) _.extend(serchObject, dataObject);
                this.collection.showMore(serchObject);
                this.changeLocationHash(deletePage, itemsNumber);
            }
            $('#check_all').prop('checked', false);
        } else {
            var newFetchModels = new this.contentCollection({
                viewType: 'list',
                sort: this.sort,
                page: deletePage,
                count: this.defaultItemsNumber,
                filter: this.filter,
                parrentContentId: this.parrentContentId,
                contentType: this.contentType,
                newCollection: this.newCollection
            });
            var that = this;
            newFetchModels.bind('reset', function () {
                that.collection.add(newFetchModels.models, {merge: true});
                that.showMoreContent(that.collection);//added two parameters page and items number
            });

            $("#gridStart").text((deletePage - 1) * itemsNumber + 1);
            if (itemsNumber === this.collectionLength && (deletePage * this.collectionLength <= this.listLength))
                $("#gridEnd").text(deletePage * itemsNumber);
            else
                $("#gridEnd").text((deletePage - 1) * itemsNumber + this.collectionLength - deleteCounter);
            $("#gridCount").text(this.listLength);
            $("#currentShowPage").val(deletePage);

            $("#pageList").empty();
            pageNumber = Math.ceil(this.listLength / itemsNumber);
            var currentPage = $("#currentShowPage").val();

            //number page show (Vasya)
            var itemsOnPage = 7;
            if (pageNumber <= itemsOnPage) {
                for (var i = 1; i <= pageNumber; i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            }
            else if (pageNumber >= itemsOnPage && currentPage <= itemsOnPage) {
                for (var i = 1; i <= itemsOnPage; i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            }

            else if (pageNumber >= itemsOnPage && currentPage > 3 && currentPage <= pageNumber - 3) {
                for (var i = currentPage - 3; i <= currentPage + 3; i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            }

            else if (currentPage >= pageNumber - 3) {
                for (var i = pageNumber - 6; i <= pageNumber; i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            }

            $("#lastPage").text(pageNumber);

            if (deletePage <= 1) {
                $("#previousPage").prop("disabled", true);
                $("#nextPage").prop("disabled", false);
                $("#firstShowPage").prop("disabled", true);
                $("#lastShowPage").prop("disabled", false);
            }
            if (deletePage >= pageNumber) {
                $("#nextPage").prop("disabled", true);
                $("#previousPage").prop("disabled", false);
                $("#firstShowPage").prop("disabled", false);
                $("#lastShowPage").prop("disabled", true);
            }
            if ((1 < deletePage) && (deletePage < pageNumber)) {
                $("#nextPage").prop("disabled", false);
                $("#previousPage").prop("disabled", false);
                $("#firstShowPage").prop("disabled", false);
                $("#lastShowPage").prop("disabled", false);
            }
            if ((deletePage == pageNumber) && (pageNumber == 1)) {
                $("#previousPage").prop("disabled", true);
                $("#nextPage").prop("disabled", true);
                $("#firstShowPage").prop("disabled", true);
                $("#lastShowPage").prop("disabled", true);
            }

            //$('#timeRecivingDataFromServer').remove();
            //this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
        }
    };

    Backbone._sync = Backbone.sync;
    // override original sync method to make header request contain csrf token
    Backbone.sync = function (method, model, options, error) {
        options.beforeSend = function (xhr) {
            xhr.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
        };
        /* proxy the call to the old sync method */
        return Backbone._sync(method, model, options, error);
    };

    app.initialize();
    app.applyDefaults();
});
