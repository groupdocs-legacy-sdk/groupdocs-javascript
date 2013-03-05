var assert = require('assert');
var gd_sdk = require('../../../src/index.js');
var ApiClient = gd_sdk.ApiClient;
var GroupDocsSecurityHandler = gd_sdk.GroupDocsSecurityHandler;
var MgmtApi = gd_sdk.MgmtApi;

gd_sdk.utils.DEBUG = true;

suite('MgmtApi', function() {
	var api, userId;
	
	this.timeout(0); 

	setup(function() {
		//TODO get from config['clientId'] using coa.js?
		var apiKey = "28090f3458bc1f97d9e0262a0768c308";
		var apiClient = new ApiClient(new GroupDocsSecurityHandler(apiKey), {
			onerror : function(callbacks, response, xhr) {
				console.log(arguments);
			}
		});
		
		userId = "a9f81d75a3a7df86";
		api = new MgmtApi(apiClient);
	});

	teardown(function() {
		// ...
	});

	test('GetUserProfile', function(done) {
		api.GetUserProfile(function(response) {
			if(response){
				assert.equal(response.status, "Ok");
			} else {
				assert.fail(response, "json", "no response from server");
			}
			done();
		}, userId);
	});

	test('UpdateUserProfile', function(done) {
		done();
	});

});
