define(['models/parrent'], function (parent) {
	var Model = parent.extend({
		defaults: {
			imageSrc: "",
			email   : "",
			position: null,
		},

		initialize: function () {
		},

		validate: function (attrs, options) {
		},

		urlRoot: function () {
			return "/personnel";
		}
	});
	return Model;
});