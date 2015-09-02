define([
    'text!templates/login/login.html',
    'custom',
    'constants'
], function (loginTemplate, custom, CONSTANTS, xss) {

    var LoginView = Backbone.View.extend({
        el: '#wrapper',
        template: _.template(loginTemplate),
        $errrorHandler: null,

        error: null,

        initialize: function (options) {
            this.render();
        },
        events: {
            "submit #loginForm": "login",
            "click .login-button": "login",
            "focus #ulogin": "usernameFocus",
            "focus #upass": "passwordFocus",
            "focusout #ulogin": "usernameFocus",
            "focusout #upass": "passwordFocus",
            "click .remember-me": "checkClick",
            "keyup #email": "checkEmail"
        },

        checkEmail: function(e){
            var target = $(e.target);

            if(!CONSTANTS.EMAIL_REGEXP.test(target.val())){
                target.addClass('error');
            } else {
                target.removeClass('error');
            }
        },

        render: function (options) {
            var thisEl = this.$el;
            thisEl.html(this.template());

            //thisEl.find("#loginForm").addClass("notRegister");

            this.$errrorHandler = $('#errorHandler');

            return this;
        },

        usernameFocus: function (event) {
            this.$el.find(".icon-login").toggleClass("active");
        },

        passwordFocus: function (event) {
            this.$el.find(".icon-pass").toggleClass("active");

        },

        checkClick: function (event) {
            this.$el.find(".remember-me").toggleClass("active");
            if (this.$el.find("#urem").attr("checked")) {
                this.$el.find("#urem").removeAttr("checked");
            } else {
                this.$el.find("#urem").attr("checked", "checked");
            }
        },

        login: function (event) {
            event.preventDefault();

            var errorHandler = this.$errrorHandler;
            var err = this.error = "";
            var self = this;
            var thisEl = this.$el;
            var loginForm = thisEl.find("#loginForm");
            var email = thisEl.find("#email").val();
            var pass = thisEl.find("#pass").val();

            email = _.escape(email);

            alert(email);

            var data = {
                email: email,
                pass: pass
            };

            var errors = thisEl.find('input.error');

            if(errors.length){
                errorHandler.text("Invalid credentials. Please try again");
                errorHandler.show();
                return;
            }

            loginForm.removeClass("notRegister");

            if (data.pass.length < 3) {
                err += "Password must be longer than 3 characters";
            }
            if (err) {
                errorHandler.text(err);
                loginForm.addClass("notRegister");

                errorHandler.show();
                return;
            }
            if (data.login === "") {
                loginForm.addClass("notRegister");
            }

            $.ajax({
                url: "/login",
                type: "POST",
                data: data,
                success: function () {
                    custom.runApplication(true);
                },
                error: function () {
                    loginForm.addClass("notRegister");

                    errorHandler.text("Such user doesn't registered");
                    errorHandler.show();
                }
            });
        }
    });

    return LoginView;

});