var ApiException = function(message, code) {
	this.name = "ApiException";
	this.message = (message || "");
	this.code = (code || 400);
};

ApiException.prototype = new Error();

ApiException.prototype.toString = function() {
	return '[' + this.name + ': ' + this.code + '] ' + this.message;
};

var SecurityHandler = function() {
};

SecurityHandler.prototype.handleURL = function(url, headers) {
	return url;
};

SecurityHandler.prototype.handleBody = function(body, headers) {
	return body;
};

var toPathValue = function(value) {
	if (isArray(value))
		return value.join(",");
	else
		return value == null ? "" : value.toString();
};

var buildQuery = function(arr) {
	var key, val, tmp_arr = [], i = 0;
	for (key in arr) {
		val = arr[key];
		tmp_arr[i] = key + '=' + val;
		i++;
	}
	return tmp_arr.join("&");
};

var splitUrl = (function() {
	// var regex = new RegExp("(\\w+)://([^/]+)([^\?]*)([\?].+)?");
	var regex = new RegExp("^(\\w+):\/{2}([^\\/:]+)(?:\\:(\\d+))?(\\/(?:[^?]+\\/)?)?([^\\?#]+)?(?:\\?([^#]*))?(\\#.*)?$");
	return function(url) {
		var matches = url.match(regex);
		var host = (matches[2] || "");
		var port = (matches[3] || "");
		var path = (matches[4] || "");
		var name = (matches[5] || "");
		var query = (matches[6] || "");
		var file = path + name + ( query ? ("?" + query) : "");
		var authority = host + ( port ? (":" + port) : "");
		return {
			"schema" : matches[1],
			"host" : host,
			"port" : port,
			"path" : path,
			"name" : name,
			"query" : query,
			"file" : file,
			"authority" : authority
		};
	};
})();

var isObject = function(value) {
	return (Object.prototype.toString.call(value) === '[object Object]');
};

var isArray = function(value) {
	return (Object.prototype.toString.call(value) === '[object Array]');
};

var isFunction = function(value) {
	return (Object.prototype.toString.call(value) === '[object Function]');
};

var mergeOptions = function(obj1, obj2) {
	var obj3 = {};
	for (var attrname in obj1) {
		obj3[attrname] = obj1[attrname];
	}
	for (var attrname in obj2) {
		obj3[attrname] = obj2[attrname];
	}
	return obj3;
}; 

var log = function(msg){
	if(exports.DEBUG){
		console.log(msg);
	}
};

exports.DEBUG = false;
exports.log = log;
exports.mergeOptions = mergeOptions;
exports.toPathValue = toPathValue;
exports.buildQuery = buildQuery;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.splitUrl = splitUrl;
exports.SecurityHandler = SecurityHandler;
exports.ApiException = ApiException;