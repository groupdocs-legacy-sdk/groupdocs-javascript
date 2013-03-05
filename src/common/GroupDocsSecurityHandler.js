var utils = require("./utils");
var jsSHA = require("./jsSHA");

var GroupDocsSecurityHandler = function(privateKey) {
	this.privateKey = privateKey;
};

GroupDocsSecurityHandler.prototype = new utils.SecurityHandler();

GroupDocsSecurityHandler.prototype.handleURL = function(url, headers) {
	var urlParts = utils.splitUrl(url);
	var pathAndQuery = encodeURI(urlParts.file);
	var shaObj = new jsSHA(pathAndQuery, "TEXT");
	//TODO replace jsSHA with crypto-browserify
	var hmac = shaObj.getHMAC(this.privateKey, "TEXT", "SHA-1", "B64", {
		"b64Pad" : ""
	});
	return url + (urlParts.query ? '&' : '?') + "signature=" + encodeURIComponent(hmac);
};

module.exports = GroupDocsSecurityHandler;
