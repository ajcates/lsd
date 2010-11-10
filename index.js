var log = require("logging").from(__filename);
/*
LSD - A module that lets you take "trips" thourgh callbacks.
copyright @ajcates 2010
MIT Licensed
*/

exports.dose = function() {
	var rest = arguments,
		dose = arguments.callee,
		multiCount = 0,
		allArgs = [];
	
	if( typeof( arguments[0] )  === "function" ) {
		//set up a state that is useful for calling qued up funcs
		var state = {
			next : function() {
				//calls the next callback.
				return dose.apply(this, Array.prototype.slice.apply(rest, [1]));
			},
			multi : function() {
				//factory function for handling the logic of multiple callbacks
				multiCount++;
				return function() {
					allArgs.push(arguments);
					multiCount--;
					arguments = allArgs;
					if(multiCount <= 0) {
						log("arguments");
						log(arguments);
						return dose.apply(this, Array.prototype.slice.apply(rest, [1]));
					}
				};
			}
		};
		//Call the first func and pass the parents caller args
		return arguments[0].apply(state, arguments.callee.caller.arguments);
	}
	return arguments[0];
}

exports.trip = function() {
	//save a trip for later.
	return function() {
		exports.dose.apply(caller.arguments, this);
	};
}