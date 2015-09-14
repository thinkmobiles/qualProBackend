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

    Backbone.View.prototype.changeLocationHash = function (page, count, filter) {
        var location = window.location.hash;
        var mainLocation = '#easyErp/' + this.contentType + '/' + this.viewType;
        var pId = (location.split('/pId=')[1]) ? location.split('/pId=')[1].split('/')[0] : '';
        var url;
        var thumbnails;
        var locationFilter;
        var notEmptyFilter;

        if (!page && this.viewType == 'list') {
            page = (location.split('/p=')[1]) ? location.split('/p=')[1].split('/')[0] : 1;
        }

        if (!count) {
            thumbnails = location.split('thumbnails')[0];
            count = (location.split('/c=')[1]) ? location.split('/c=')[1].split('/')[0] : 100;

            if (thumbnails && count < 100) {
                count = 100;
            }
        }

        url = mainLocation;
        if (pId) {
            url += '/pId=' + pId;
        }
        if (page) {
            url += '/p=' + page;
        }
        if (count) {
            url += '/c=' + count;
        }
        if (!filter) {
            locationFilter = location.split('/filter=')[1];
            filter = (locationFilter) ? JSON.parse(decodeURIComponent(locationFilter)) : null;
        }
        if (filter) {
            notEmptyFilter = false;
            for (var i in filter) {
                if (filter[i] && filter[i].length !== 0) {
                    notEmptyFilter = true;
                }
            }
            if (notEmptyFilter) {
                url += '/filter=' + encodeURIComponent(JSON.stringify(filter));
            } else {
                url += '';
            }
        }

        Backbone.history.navigate(url);
    };

    Backbone.View.prototype.pageElementRender = function (totalCount, itemsNumber, currentPage) {
        //ToDO Refactor this method

        var itemsNumber = this.defaultItemsNumber;
        $("#itemsNumber").text(itemsNumber);
        var start = $("#gridStart");
        var end = $("#gridEnd");

        if (totalCount == 0 || totalCount == undefined) {
            start.text(0);
            end.text(0);
            $("#gridCount").text(0);
            $("#previousPage").prop("disabled", true);
            $("#nextPage").prop("disabled", true);
            $("#firstShowPage").prop("disabled", true);
            $("#lastShowPage").prop("disabled", true);
            $("#pageList").empty();
            $("#currentShowPage").val(0);
            $("#lastPage").text(0);
        } else {
            currentPage = currentPage || 1;
            start.text(currentPage * itemsNumber - itemsNumber + 1);
            if (totalCount <= itemsNumber || totalCount <= currentPage * itemsNumber) {
                end.text(totalCount);
            } else {
                end.text(currentPage * itemsNumber);
            }
            $("#gridCount").text(totalCount);

            $("#pageList").empty();
            var pageNumber = Math.ceil(totalCount / itemsNumber);
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
            //end number page show
            $("#lastPage").text(pageNumber);
            $("#currentShowPage").val(currentPage);
            $("#previousPage").prop("disabled", parseInt(start.text()) <= parseInt(currentPage));
            $("#firstShowPage").prop("disabled", parseInt(start.text()) <= parseInt(currentPage));
            if (pageNumber <= 1) {
                $("#nextPage").prop("disabled", true);
                $("#lastShowPage").prop("disabled", true);
            } else {
                $("#nextPage").prop("disabled", parseInt(end.text()) === parseInt(totalCount));
                $("#lastShowPage").prop("disabled", parseInt(end.text()) === parseInt(totalCount));
            }
        }
    };

    Backbone.View.prototype.previousPage = function (dataObject) {
        var itemsNumber = $("#itemsNumber").text();
        var currentShowPage = $("#currentShowPage");
        var page = parseInt(currentShowPage.val()) - 1;
        var pageNumber;
        var itemsOnPage;
        var serchObject;

        currentShowPage.val(page);

        if (page === 1) {
            $("#previousPage").prop("disabled", true);
            $("#firstShowPage").prop("disabled", true);
        }

        pageNumber = $("#lastPage").text();
        itemsOnPage = 7;

        $("#pageList").empty();

        if (pageNumber <= itemsOnPage) {
            for (var i = 1; i <= pageNumber; i++) {
                $("#pageList").append('<li class="showPage">' + i + '</li>');
            }
        } else if (pageNumber >= itemsOnPage && page <= itemsOnPage) {
            for (var i = 1; i <= itemsOnPage; i++) {
                $("#pageList").append('<li class="showPage">' + i + '</li>');
            }
        } else if (pageNumber >= itemsOnPage && page > 3 && page <= pageNumber - 3) {
            for (var i = page - 3; i <= page + 3; i++) {
                $("#pageList").append('<li class="showPage">' + i + '</li>');
            }
        } else if (page >= page - 3) {
            for (var i = pageNumber - 6; i <= pageNumber; i++) {
                $("#pageList").append('<li class="showPage">' + i + '</li>');
            }
        }

        $("#gridStart").text((page - 1) * itemsNumber + 1);

        if (this.listLength <= page * itemsNumber) {
            $("#gridEnd").text(this.listLength);
        } else {
            $("#gridEnd").text(page * itemsNumber);
        }

        $("#nextPage").prop("disabled", false);
        $("#lastShowPage").prop("disabled", false);

        serchObject = {
            count: itemsNumber,
            page: page,
            letter: this.selectedLetter
        };

        if (dataObject) {
            _.extend(serchObject, dataObject);
        }


        this.changeLocationHash(page, itemsNumber);
    };

    Backbone.View.prototype.nextPage = function (dataObject) {
        this.startTime = new Date();
        var itemsNumber = $("#itemsNumber").text();
        var page = parseInt($("#currentShowPage").val()) + 1;

        this.startTime = new Date();
        var pageNumber = $("#lastPage").text();
        var itemsOnPage = 7;
        //number page show (Vasya)
        $("#pageList").empty();
        if (pageNumber <= itemsOnPage) {
            for (var i = 1; i <= pageNumber; i++) {
                $("#pageList").append('<li class="showPage">' + i + '</li>');
            }
        }
        else if (pageNumber >= itemsOnPage && page > 3 && page < pageNumber - 3) {
            for (var i = page - 3; i <= page + 3; i++) {
                $("#pageList").append('<li class="showPage">' + i + '</li>');
            }
        }
        else if (pageNumber >= itemsOnPage && page <= itemsOnPage) {
            for (var i = 1; i <= itemsOnPage; i++) {
                $("#pageList").append('<li class="showPage">' + i + '</li>');
            }
        }

        else if (page >= pageNumber - 3) {
            for (var i = pageNumber - 6; i <= pageNumber; i++) {
                $("#pageList").append('<li class="showPage">' + i + '</li>');
            }
        }
        //end number page show (Vasya)
        $("#currentShowPage").val(page);
        $("#gridStart").text((page - 1) * itemsNumber + 1);
        if (this.listLength <= page * itemsNumber) {
            $("#gridEnd").text(this.listLength);
            $("#nextPage").prop("disabled", true);
            $("#lastShowPage").prop("disabled", true);
        } else {
            $("#gridEnd").text(page * itemsNumber);
        }
        $("#previousPage").prop("disabled", false);
        $("#firstShowPage").prop("disabled", false);

        var serchObject = {
            count: itemsNumber,
            page: page,
            letter: this.selectedLetter
        };

        if (dataObject) _.extend(serchObject, dataObject);
        this.collection.showMore(serchObject);
        this.changeLocationHash(page, itemsNumber);
    };

    Backbone.View.prototype.firstPage = function (dataObject) {
        this.startTime = new Date();
        var itemsNumber = $("#itemsNumber").text();
        var currentShowPage = $("#currentShowPage");
        var page = 1;

        this.startTime = new Date();

        currentShowPage.val(page);
        var lastPage = $("#lastPage").text();
        if (page === 1) {
            $("#firstShowPage").prop("disabled", true);
        }
        //number page show
        $("#pageList").empty();
        if (lastPage >= 7) {
            for (var i = 1; i <= 7; i++) {
                $("#pageList").append('<li class="showPage">' + i + '</li>');
            }
        } else {
            for (var i = 1; i <= lastPage; i++) {
                $("#pageList").append('<li class="showPage">' + i + '</li>');
            }
        }
        $("#gridStart").text((page - 1) * itemsNumber + 1);
        if (this.listLength <= page * itemsNumber) {
            $("#gridEnd").text(this.listLength);
        } else {
            $("#gridEnd").text(page * itemsNumber);
        }
        $("#previousPage").prop("disabled", true);
        $("#nextPage").prop("disabled", false);
        $("#lastShowPage").prop("disabled", false);
        var serchObject = {
            count: itemsNumber,
            page: page,
            letter: this.selectedLetter
        };
        if (dataObject) _.extend(serchObject, dataObject);
        this.collection.showMore(serchObject);
        this.changeLocationHash(page, itemsNumber);
    };

    Backbone.View.prototype.lastPage = function (dataObject) {
        this.startTime = new Date();
        var itemsNumber = $("#itemsNumber").text();
        var page = $("#lastPage").text();
        $("#firstShowPage").prop("disabled", true);
        this.startTime = new Date();
        $("#pageList").empty();
        //number page show
        if (page >= 7) {
            for (var i = page - 6; i <= page; i++) {
                $("#pageList").append('<li class="showPage">' + i + '</li>');
            }
        }
        else {
            for (var i = 1; i <= page; i++) {
                $("#pageList").append('<li class="showPage">' + i + '</li>');
            }
        }
        //end number page show (Vasya)
        $("#currentShowPage").val(page);
        $("#gridStart").text((page - 1) * itemsNumber + 1);
        if (this.listLength <= page * itemsNumber) {
            $("#gridEnd").text(this.listLength);
            $("#nextPage").prop("disabled", true);
        } else {
            $("#gridEnd").text(page * itemsNumber);
        }
        $("#nextPage").prop("disabled", true);
        $("#lastShowPage").prop("disabled", true);
        $("#previousPage").prop("disabled", false);
        $("#firstShowPage").prop("disabled", false);
        var serchObject = {
            count: itemsNumber,
            page: page,
            letter: this.selectedLetter
        };
        if (dataObject) _.extend(serchObject, dataObject);
        this.collection.showMore(serchObject);
        this.changeLocationHash(page, itemsNumber);
    };

    Backbone.View.prototype.showPage = function (event, dataObject) {
        this.startTime = new Date();
        if (this.listLength == 0) {
            $("#currentShowPage").val(0);
        } else {
            var itemsNumber = $("#itemsNumber").text();
            var page = parseInt(event.target.textContent);
            if (!page) {
                page = $(event.target).val();
            }
            var adr = /^\d+$/;
            var lastPage = parseInt($('#lastPage').text());
            var itemsNumber = $("#itemsNumber").text();
            if (!adr.test(page) || (parseInt(page) <= 0) || (parseInt(page) > parseInt(lastPage))) {
                page = 1;
            }
            //number page show (Vasya)
            var itemsOnPage = 7;
            $("#pageList").empty();
            if (parseInt(lastPage) <= itemsOnPage) {
                for (var i = 1; i <= parseInt(lastPage); i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            }
            else if (page >= 5 && page <= itemsOnPage) {
                for (var i = parseInt(page) - 3; i <= parseInt(page) + 3; i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            }
            else if (lastPage >= itemsOnPage && page <= itemsOnPage) {
                for (var i = 1; i <= itemsOnPage; i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            }
            else if (lastPage >= itemsOnPage && page > 3 && page <= parseInt(lastPage) - 3) {
                for (var i = parseInt(page) - 3; i <= parseInt(page) + 3; i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            }

            else if (page >= parseInt(lastPage) - 3) {
                for (var i = lastPage - 6; i <= parseInt(lastPage); i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            }
            //number page show
            $("#currentShowPage").val(page);
            $("#gridStart").text((page - 1) * itemsNumber + 1);
            if (this.listLength <= page * itemsNumber) {
                $("#gridEnd").text(this.listLength);
            } else {
                $("#gridEnd").text(page * itemsNumber);
            }
            if (page <= 1) {
                $("#previousPage").prop("disabled", true);
                $("#nextPage").prop("disabled", false);
                $("#firstShowPage").prop("disabled", true);
                $("#lastShowPage").prop("disabled", false);
            }
            if (page >= lastPage) {
                $("#nextPage").prop("disabled", true);
                $("#previousPage").prop("disabled", false);
                $("#lastShowPage").prop("disabled", true);
                $("#firstShowPage").prop("disabled", false);
            }
            if ((1 < page) && (page < lastPage)) {
                $("#nextPage").prop("disabled", false);
                $("#previousPage").prop("disabled", false);
                $("#lastShowPage").prop("disabled", false);
                $("#firstShowPage").prop("disabled", false);
            }
            if ((page == lastPage) && (lastPage == 1)) {
                $("#previousPage").prop("disabled", true);
                $("#nextPage").prop("disabled", true);
                $("#firstShowPage").prop("disabled", true);
                $("#lastShowPage").prop("disabled", true);
            }
            var serchObject = {
                count: itemsNumber,
                page: page,
                letter: this.selectedLetter
            };
            if (dataObject) _.extend(serchObject, dataObject);
            this.collection.showMore(serchObject);
            this.changeLocationHash(page, itemsNumber);
        }
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
