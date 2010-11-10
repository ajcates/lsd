var log = require("logging").from(__dirname);
/*
LSD - A module that lets you take "trips" thourgh callbacks.
copyright @ajcates 2010
MIT Licensed
*/

exports.multiList = function(list, scope) {
	list.map(function(i) {
		return [scope.multi(), i];
	}, this).forEach(function(i) {
		i[0].apply(scope, i);
	});
};

exports.dose = function() {
	var rest = arguments,
		dose = arguments.callee;
	if(rest.length) {
		if( typeof( arguments[0] )  === "function" ) {
			//set up a state that is useful for calling qued up funcs
			var state = {
				allArgs : [],
				multiCount : 0,
				multiList : exports.multiList,
				next : function() {
					//calls the next callback.
					//arguments = allArgs;
					//arguments.callee.caller.arguments
					return dose.apply(this, Array.prototype.slice.apply(rest, [1]));
				},
				multi : function() {
					//factory function for handling the logic of multiple callbacks
					var $t = state;
					$t.multiCount++;
					
					return function() {
						log("multi func");
						log($t);
						
						$t.allArgs.push(arguments);
						$t.multiCount--;
						if($t.multiCount <= 0) {
							arguments = $t.allArgs;
							//log("arguments");
							//log(arguments);
							
							return dose.apply($t, Array.prototype.slice.apply(rest, [1]));
						}
					};
				}
			};
			arguments[0].apply(state, Array.prototype.constructor.apply(this, arguments.callee.caller.arguments));
		}
		//return arguments.callee.apply(this, Array.prototype.slice.apply(rest, [1]));
	}
	//return null;
};

exports.trip = function() {
	//save a trip for later.
	var args = arguments;
	return function() {
		exports.dose.apply(this, args);
	};
};