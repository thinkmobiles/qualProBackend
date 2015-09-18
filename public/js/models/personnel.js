define(['models/parrent', 'Validation'], function (parent, Validation) {
	var Model = parent.extend({
		defaults: {
			imageSrc: "",
			email   : "",
			position: null,
		},

        initialize: function () {
            this.on('invalid', function (model, errors) {
                var errorsLength = errors.length;

                if (errorsLength > 0) {
                    for (var i = errorsLength; i > 0; i--) {
                        App.render({type: 'error', message: errors[i]});
                    }
                }
            });
        },

        validate: function (attrs) {
            var errors = [];

            Validation.checkNameField(errors, true, attrs.firstName, "First name");
            Validation.checkNameField(errors, true, attrs.lastName, "Last name");
            Validation.checkEmailField(errors, true, attrs.email, "Email");
            Validation.checkPhoneField(errors, false, attrs.phoneNumber, "Phone number");

            if (errors.length > 0) {
                return errors;
            }
        },

        urlRoot: function () {
            return "/personnel";
        }
    });

    return Model;
});