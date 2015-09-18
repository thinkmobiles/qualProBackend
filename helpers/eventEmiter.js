module.exports = function(event){
	event.on('createdChild', function (options) {
		options = options || {};

		var searchObject = {};
		var updateObject = {};
		var id = options.id;
		var targetModel = options.targetModel;
		var fieldName = options.fieldName;
		var fieldValue = options.fieldValue;
		var isArray = options.isArray;

		searchObject[searchField] = id;

		if (fieldInArray) {
			updateObject['$addToSet'] = {};
			updateObject['$addToSet'][fieldName] = fieldValue;
		} else {
			updateObject[fieldName] = fieldValue;
		}

		targetModel.update(searchObject, updateObject, {multi: true}, function(err){
			if(err){
				logWriter.log('eventEmiter_createdChild', err.message);
			}
		});
	});
};
