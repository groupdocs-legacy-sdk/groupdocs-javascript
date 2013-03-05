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
 * @this StorageApi
 * @param {ApiClient} apiClient The ApiClient instance (required)
 * @param {string} basePath The base path of API server (optional)
 */
var StorageApi = function(apiClient, basePath) {
	this.apiClient = apiClient;
	this.basePath = (basePath || "https://api.groupdocs.com/v2.0");
};

/**
 * Get storage info
 *
 * @param String userId User GUID (required).
 *
 * @return this 
 */
StorageApi.prototype.GetStorageInfo = function(callbacks, userId) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
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
 * List entities
 *
 * @param String userId User GUID (required).
 * @param String path Path (optional).
 * @param Number pageIndex Page Index (optional).
 * @param Number pageSize Page Size (optional).
 * @param String orderBy Order By (optional).
 * @param Boolean orderAsc Order Asc (optional).
 * @param String filter Filter (optional).
 * @param String fileTypes File Types (optional).
 * @param Boolean extended Indicates whether an extended information should be returned (optional).
 *
 * @return this 
 */
StorageApi.prototype.ListEntities = function(callbacks, userId, path, pageIndex, pageSize, orderBy, orderAsc, filter, fileTypes, extended) {
	if(userId == null || path == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/folders/{path}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "path" + "}", utils.toPathValue(path));
	// add query parameters
	var queryParams = [];
	if (pageIndex != null) {
		queryParams['page'] = utils.toPathValue(pageIndex);
	}
	if (pageSize != null) {
		queryParams['count'] = utils.toPathValue(pageSize);
	}
	if (orderBy != null) {
		queryParams['order_by'] = utils.toPathValue(orderBy);
	}
	if (orderAsc != null) {
		queryParams['order_asc'] = utils.toPathValue(orderAsc);
	}
	if (filter != null) {
		queryParams['filter'] = utils.toPathValue(filter);
	}
	if (fileTypes != null) {
		queryParams['file_types'] = utils.toPathValue(fileTypes);
	}
	if (extended != null) {
		queryParams['extended'] = utils.toPathValue(extended);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get file
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 *
 * @return this 
 */
StorageApi.prototype.GetFile = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/files/{fileId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.prepareToCallAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get shared file
 *
 * @param String userEmail User Email (required).
 * @param String filePath File path (required).
 *
 * @return this 
 */
StorageApi.prototype.GetSharedFile = function(callbacks, userEmail, filePath) {
	if(userEmail == null || filePath == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/shared/{userEmail}/{filePath}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userEmail" + "}", utils.toPathValue(userEmail));
	resourcePath = resourcePath.replace("{" + "filePath" + "}", utils.toPathValue(filePath));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.prepareToCallAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Upload
 *
 * @param String userId User GUID (required).
 * @param String path Path (required).
 * @param String description Description (optional).
 * @param stream body Stream (required).
 *
 * @return this 
 */
StorageApi.prototype.Upload = function(callbacks, userId, path, description, body) {
	if(userId == null || path == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/folders/{path}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "path" + "}", utils.toPathValue(path));
	// add query parameters
	var queryParams = [];
	if (description != null) {
		queryParams['description'] = utils.toPathValue(description);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * UploadAndUnzip
 *
 * @param String userId User GUID (required).
 * @param String path Path (required).
 * @param String description Description (optional).
 * @param String archiveType Archive type (optional).
 * @param stream body Stream (required).
 *
 * @return this 
 */
StorageApi.prototype.Decompress = function(callbacks, userId, path, description, archiveType, body) {
	if(userId == null || path == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/decompress/{path}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "path" + "}", utils.toPathValue(path));
	// add query parameters
	var queryParams = [];
	if (description != null) {
		queryParams['description'] = utils.toPathValue(description);
	}
	if (archiveType != null) {
		queryParams['archiveType'] = utils.toPathValue(archiveType);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Upload Web
 *
 * @param String userId User GUID (required).
 * @param String url Url (required).
 *
 * @return this 
 */
StorageApi.prototype.UploadWeb = function(callbacks, userId, url) {
	if(userId == null || url == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/urls";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (url != null) {
		queryParams['url'] = utils.toPathValue(url);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Upload Google
 *
 * @param String userId User GUID (required).
 * @param String path File path (required).
 * @param String fileId File unique identifier (optional).
 *
 * @return this 
 */
StorageApi.prototype.UploadGoogle = function(callbacks, userId, path, fileId) {
	if(userId == null || path == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/google/files/{path}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "path" + "}", utils.toPathValue(path));
	// add query parameters
	var queryParams = [];
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
 * Delete
 *
 * @param String userId User GUID (required).
 * @param String fileId File ID (required).
 *
 * @return this 
 */
StorageApi.prototype.Delete = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/files/{fileId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "DELETE", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Delete from folder
 *
 * @param String userId User GUID (required).
 * @param String path Path (required).
 *
 * @return this 
 */
StorageApi.prototype.DeleteFromFolder = function(callbacks, userId, path) {
	if(userId == null || path == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/folders/{path}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "path" + "}", utils.toPathValue(path));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "DELETE", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Move file
 *
 * @param String userId User GUID (required).
 * @param String path Path (required).
 * @param String mode Mode (optional).
 * @param String Groupdocs_Copy File ID (copy) (optional).
 * @param String Groupdocs_Move File ID (move) (optional).
 *
 * @return this 
 */
StorageApi.prototype.MoveFile = function(callbacks, userId, path, mode, Groupdocs_Copy, Groupdocs_Move) {
	if(userId == null || path == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/files/{path}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "path" + "}", utils.toPathValue(path));
	// add query parameters
	var queryParams = [];
	if (mode != null) {
		queryParams['mode'] = utils.toPathValue(mode);
	}
	// add header parameters
	var headerParams = [];
	if (Groupdocs_Copy != null) {
		headerParams['Groupdocs-Copy'] = utils.toPathValue(Groupdocs_Copy);
	}
	if (Groupdocs_Move != null) {
		headerParams['Groupdocs-Move'] = utils.toPathValue(Groupdocs_Move);
	}
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Move folder
 *
 * @param String userId User GUID (required).
 * @param String path Destination Path (required).
 * @param String mode Mode (optional).
 * @param String Groupdocs_Move Source path (move) (optional).
 * @param String Groupdocs_Copy Source path (copy) (optional).
 *
 * @return this 
 */
StorageApi.prototype.MoveFolder = function(callbacks, userId, path, mode, Groupdocs_Move, Groupdocs_Copy) {
	if(userId == null || path == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/folders/{path}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "path" + "}", utils.toPathValue(path));
	// add query parameters
	var queryParams = [];
	if (mode != null) {
		queryParams['override_mode'] = utils.toPathValue(mode);
	}
	// add header parameters
	var headerParams = [];
	if (Groupdocs_Move != null) {
		headerParams['Groupdocs-Move'] = utils.toPathValue(Groupdocs_Move);
	}
	if (Groupdocs_Copy != null) {
		headerParams['Groupdocs-Copy'] = utils.toPathValue(Groupdocs_Copy);
	}
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Create
 *
 * @param String userId User GUID (required).
 * @param String path Path (required).
 *
 * @return this 
 */
StorageApi.prototype.Create = function(callbacks, userId, path) {
	if(userId == null || path == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/paths/{path}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "path" + "}", utils.toPathValue(path));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Compress
 *
 * @param String userId User GUID (required).
 * @param String fileId File ID (required).
 * @param String archiveType Archive type (optional).
 *
 * @return this 
 */
StorageApi.prototype.Compress = function(callbacks, userId, fileId, archiveType) {
	if(userId == null || fileId == null || archiveType == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/files/{fileId}/archive/{archiveType}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	resourcePath = resourcePath.replace("{" + "archiveType" + "}", utils.toPathValue(archiveType));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Create Package
 *
 * @param String userId User GUID (required).
 * @param String packageName Package Name (required).
 * @param Boolean storeRelativePath Store files using relative paths (optional).
 * @param List[String] body Paths (optional).
 *
 * @return this 
 */
StorageApi.prototype.CreatePackage = function(callbacks, userId, packageName, storeRelativePath, body) {
	if(userId == null || packageName == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/packages/{packageName}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "packageName" + "}", utils.toPathValue(packageName));
	// add query parameters
	var queryParams = [];
	if (storeRelativePath != null) {
		queryParams['storeRelativePath'] = utils.toPathValue(storeRelativePath);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Move to trash
 *
 * @param String userId User GUID (required).
 * @param String path Path (required).
 *
 * @return this 
 */
StorageApi.prototype.MoveToTrash = function(callbacks, userId, path) {
	if(userId == null || path == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/trash/{path}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "path" + "}", utils.toPathValue(path));
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
 * Restore from trash
 *
 * @param String userId User GUID (required).
 * @param String path Path (required).
 *
 * @return this 
 */
StorageApi.prototype.RestoreFromTrash = function(callbacks, userId, path) {
	if(userId == null || path == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/storage/{userId}/trash/{path}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "path" + "}", utils.toPathValue(path));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "DELETE", queryParams, postData, headerParams, callbacks);
	return this;
}

module.exports = StorageApi;
