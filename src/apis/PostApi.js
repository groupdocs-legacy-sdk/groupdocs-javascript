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
 * @this PostApi
 * @param {ApiClient} apiClient The ApiClient instance (required)
 * @param {string} basePath The base path of API server (optional)
 */
var PostApi = function(apiClient, basePath) {
	this.apiClient = apiClient;
	this.basePath = (basePath || "https://api.groupdocs.com/v2.0");
};

/**
 * Rename by post
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param String newName New name (required).
 *
 * @return this 
 */
PostApi.prototype.RenameByPost = function(callbacks, userId, fileId, newName) {
	if(userId == null || fileId == null || newName == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/post/file.rename";

	// replace path parameters
	// add query parameters
	var queryParams = [];
	if (userId != null) {
		queryParams['user_id'] = utils.toPathValue(userId);
	}
	if (fileId != null) {
		queryParams['file_id'] = utils.toPathValue(fileId);
	}
	if (newName != null) {
		queryParams['new_name'] = utils.toPathValue(newName);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Delete by post
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 *
 * @return this 
 */
PostApi.prototype.DeleteByPost = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/post/file.delete";

	// replace path parameters
	// add query parameters
	var queryParams = [];
	if (userId != null) {
		queryParams['user_id'] = utils.toPathValue(userId);
	}
	if (fileId != null) {
		queryParams['file_id'] = utils.toPathValue(fileId);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Delete from folder by post
 *
 * @param String userId User GUID (required).
 * @param String path Path (required).
 *
 * @return this 
 */
PostApi.prototype.DeleteFromFolderByPost = function(callbacks, userId, path) {
	if(userId == null || path == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/post/file.delete.in";

	// replace path parameters
	// add query parameters
	var queryParams = [];
	if (userId != null) {
		queryParams['user_id'] = utils.toPathValue(userId);
	}
	if (path != null) {
		queryParams['path'] = utils.toPathValue(path);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Compress by post
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param String archiveType Archive Type (required).
 *
 * @return this 
 */
PostApi.prototype.CompressByPost = function(callbacks, userId, fileId, archiveType) {
	if(userId == null || fileId == null || archiveType == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/post/file.compress";

	// replace path parameters
	// add query parameters
	var queryParams = [];
	if (userId != null) {
		queryParams['user_id'] = utils.toPathValue(userId);
	}
	if (fileId != null) {
		queryParams['file_id'] = utils.toPathValue(fileId);
	}
	if (archiveType != null) {
		queryParams['archive_type'] = utils.toPathValue(archiveType);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

module.exports = PostApi;
