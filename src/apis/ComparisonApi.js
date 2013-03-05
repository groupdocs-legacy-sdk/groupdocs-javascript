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
 * @this ComparisonApi
 * @param {ApiClient} apiClient The ApiClient instance (required)
 * @param {string} basePath The base path of API server (optional)
 */
var ComparisonApi = function(apiClient, basePath) {
	this.apiClient = apiClient;
	this.basePath = (basePath || "https://api.groupdocs.com/v2.0");
};

/**
 * Download comparison result file
 *
 * @param String userId User GUID (required).
 * @param String resultFileId Comparison result file GUID (required).
 * @param String format Comparison result file format (optional).
 *
 * @return this 
 */
ComparisonApi.prototype.DownloadResult = function(callbacks, userId, resultFileId, format) {
	if(userId == null || resultFileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/comparison/{userId}/comparison/download";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (resultFileId != null) {
		queryParams['resultFileId'] = utils.toPathValue(resultFileId);
	}
	if (format != null) {
		queryParams['format'] = utils.toPathValue(format);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.prepareToCallAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Compare
 *
 * @param String userId User GUID (required).
 * @param String sourceFileId Source File GUID (required).
 * @param String targetFileId Target File GUID (required).
 * @param String callbackUrl Callback Url (required).
 *
 * @return this 
 */
ComparisonApi.prototype.Compare = function(callbacks, userId, sourceFileId, targetFileId, callbackUrl) {
	if(userId == null || sourceFileId == null || targetFileId == null || callbackUrl == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/comparison/{userId}/comparison/compare";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (sourceFileId != null) {
		queryParams['source'] = utils.toPathValue(sourceFileId);
	}
	if (targetFileId != null) {
		queryParams['target'] = utils.toPathValue(targetFileId);
	}
	if (callbackUrl != null) {
		queryParams['callback'] = utils.toPathValue(callbackUrl);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get changes
 *
 * @param String userId User GUID (required).
 * @param String resultFileId Comparison result file GUID (required).
 *
 * @return this 
 */
ComparisonApi.prototype.GetChanges = function(callbacks, userId, resultFileId) {
	if(userId == null || resultFileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/comparison/{userId}/comparison/changes";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (resultFileId != null) {
		queryParams['resultFileId'] = utils.toPathValue(resultFileId);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Update changes
 *
 * @param String userId User GUID (required).
 * @param String resultFileId Comparison result file GUID (required).
 * @param List[ChangeInfo] body Comparison changes to update (accept or reject) (required).
 *
 * @return this 
 */
ComparisonApi.prototype.UpdateChanges = function(callbacks, userId, resultFileId, body) {
	if(userId == null || resultFileId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/comparison/{userId}/comparison/changes";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (resultFileId != null) {
		queryParams['resultFileId'] = utils.toPathValue(resultFileId);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get document details
 *
 * @param String userId User GUID (required).
 * @param String guid Document GUID (required).
 *
 * @return this 
 */
ComparisonApi.prototype.GetDocumentDetails = function(callbacks, userId, guid) {
	if(userId == null || guid == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/comparison/{userId}/comparison/document";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (guid != null) {
		queryParams['guid'] = utils.toPathValue(guid);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

module.exports = ComparisonApi;
