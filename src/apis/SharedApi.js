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
 * @this SharedApi
 * @param {ApiClient} apiClient The ApiClient instance (required)
 * @param {string} basePath The base path of API server (optional)
 */
var SharedApi = function(apiClient, basePath) {
	this.apiClient = apiClient;
	this.basePath = (basePath || "https://api.groupdocs.com/v2.0");
};

/**
 * Download
 *
 * @param String guid GUID (required).
 * @param String fileName File name (optional).
 * @param Boolean render Render (optional).
 *
 * @return this 
 */
SharedApi.prototype.Download = function(callbacks, guid, fileName, render) {
	if(guid == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/shared/files/{guid}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "guid" + "}", utils.toPathValue(guid));
	// add query parameters
	var queryParams = [];
	if (fileName != null) {
		queryParams['filename'] = utils.toPathValue(fileName);
	}
	if (render != null) {
		queryParams['render'] = utils.toPathValue(render);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.prepareToCallAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get xml
 *
 * @param String guid GUID (required).
 *
 * @return this 
 */
SharedApi.prototype.GetXml = function(callbacks, guid) {
	if(guid == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/shared/files/{guid}/xml";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "guid" + "}", utils.toPathValue(guid));
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
 * Get package
 *
 * @param String path Path (required).
 *
 * @return this 
 */
SharedApi.prototype.GetPackage = function(callbacks, path) {
	if(path == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/shared/packages/{path}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "path" + "}", utils.toPathValue(path));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.prepareToCallAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

module.exports = SharedApi;
