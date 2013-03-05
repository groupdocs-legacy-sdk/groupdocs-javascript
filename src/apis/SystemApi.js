/**
 *  Copyright 2012 GroupDocs.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var utils = require("../common/utils");

/**
 * 
 *
 * @constructor
 * @this SystemApi
 * @param {ApiClient} apiClient The ApiClient instance (required)
 * @param {string} basePath The base path of API server (optional)
 */
var SystemApi = function(apiClient, basePath) {
	this.apiClient = apiClient;
	this.basePath = (basePath || "https://api.groupdocs.com/v2.0");
};

/**
 * Get user plan
 *
 * @param String callerId User GUID (required).
 *
 * @return this 
 */
SystemApi.prototype.GetUserPlan = function(callbacks, callerId) {
	if(callerId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/system/{callerId}/plan";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get user plan
 *
 * @param String callerId User GUID (required).
 *
 * @return this 
 */
SystemApi.prototype.GetUserSubscriptionPlan = function(callbacks, callerId) {
	if(callerId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/system/{callerId}/subscription";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get subscription plans
 *
 * @param String callerId User GUID (required).
 * @param String family Product Family Name (required).
 *
 * @return this 
 */
SystemApi.prototype.GetSubscriptionPlans = function(callbacks, callerId, family) {
	if(callerId == null || family == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/system/{callerId}/plans/{family}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
	resourcePath = resourcePath.replace("{" + "family" + "}", utils.toPathValue(family));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Set subscription plan user plan
 *
 * @param String userId User GUID (required).
 * @param String productId Product ID (required).
 * @param SubscriptionPlanInfo body Subscription Plan (required).
 *
 * @return this 
 */
SystemApi.prototype.SetSubscriptionPlan = function(callbacks, userId, productId, body) {
	if(userId == null || productId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/system/{userId}/subscriptions/{productId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "productId" + "}", utils.toPathValue(productId));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get countries
 *
 * @param String callerId User GUID (required).
 *
 * @return this 
 */
SystemApi.prototype.GetCountries = function(callbacks, callerId) {
	if(callerId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/system/{callerId}/countries";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get states
 *
 * @param String callerId User GUID (required).
 * @param String countryName Country Name (required).
 *
 * @return this 
 */
SystemApi.prototype.GetStates = function(callbacks, callerId, countryName) {
	if(callerId == null || countryName == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/system/{callerId}/countries/{countryName}/states";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
	resourcePath = resourcePath.replace("{" + "countryName" + "}", utils.toPathValue(countryName));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

module.exports = SystemApi;
