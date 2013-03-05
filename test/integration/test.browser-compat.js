var assert = require('assert');
var gd_sdk = require('../../src/index.js');
var ApiClient = gd_sdk.ApiClient;
var GroupDocsSecurityHandler = gd_sdk.GroupDocsSecurityHandler;
var MgmtApi = gd_sdk.MgmtApi;

gd_sdk.utils.DEBUG = true;
if (process.browser) {
	console.log("running in browser");
} else {
	console.log(global);
}

suite('Browser Compatibility using XmlHttpRequest', function() {
	var userId, apiClient;

	this.timeout(0);

	setup(function() {
		// TODO get from external JS?
		var apiKey = "8d8a7d642a807a31c2741c101a60cef2";
		userId = "2721ad21bcf0d71e";
		apiClient = new ApiClient(new GroupDocsSecurityHandler(apiKey), {
			onerror : function(event) {
				console.log(event);
			}
		});
	});

	teardown(function() {
		// ...
	});

	test('Simple GET request', function(done) {
		new MgmtApi(apiClient, "https://dev-api.groupdocs.com/v2.0")
				.GetUserProfile(function(response) {
					console.log(response);
					if (response) {
						console.log("response.status=" + response.status);
						assert.equal(response.status, "Ok");
					} else {
						assert
								.fail(response, "json",
										"no response from server");
					}
					done();
				}, userId);
	});

	test('Simple POST request', function(done) {
		done();
	});

	test('Simple PUT request', function(done) {
		done();
	});

	test('Simple DELETE request', function(done) {
		done();
	});

	test('POST request with payload', function(done) {
		done();
	});

	test('Request with custom headers', function(done) {
		done();
	});

});

suite('Browser Compatibility using jQuery', function() {
	var userId, apiClient;

	this.timeout(0);

	setup(function() {
		// TODO get from external JS?
		var apiKey = "8d8a7d642a807a31c2741c101a60cef2";
		userId = "2721ad21bcf0d71e";
		apiClient = new ApiClient(new GroupDocsSecurityHandler(apiKey), {
			useJqueryForAjax : true,
			onerror : function(callbacks, response, xhr) {
				console.log(arguments);
			}
		});
	});

	teardown(function() {
		// ...
	});

	test('Simple GET request', function(done) {
		new MgmtApi(apiClient, "https://dev-api.groupdocs.com/v2.0")
				.GetUserProfile(function(response) {
					console.log(response);
					if (response) {
						console.log("response.status=" + response.status);
						assert.equal(response.status, "Ok");
					} else {
						assert
								.fail(response, "json",
										"no response from server");
					}
					done();
				}, userId);
	});

	test('Simple POST request', function(done) {
		done();
	});

	test('Simple PUT request', function(done) {
		done();
	});

	test('Simple DELETE request', function(done) {
		done();
	});

	test('POST request with payload', function(done) {
		done();
	});

	test('Request with custom headers', function(done) {
		done();
	});

});
