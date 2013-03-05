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
 * @this AsyncApi
 * @param {ApiClient} apiClient The ApiClient instance (required)
 * @param {string} basePath The base path of API server (optional)
 */
var AsyncApi = function(apiClient, basePath) {
	this.apiClient = apiClient;
	this.basePath = (basePath || "https://api.groupdocs.com/v2.0");
};

/**
 * Get job
 *
 * @param String userId User GUID (required).
 * @param String jobId Job Id or Guid (required).
 *
 * @return this 
 */
AsyncApi.prototype.GetJob = function(callbacks, userId, jobId) {
	if(userId == null || jobId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/async/{userId}/jobs/{jobId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "jobId" + "}", utils.toPathValue(jobId));
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
 * Get job json
 *
 * @param String userId User GUID (required).
 * @param String jobId Job id (required).
 *
 * @return this 
 */
AsyncApi.prototype.GetJobJson = function(callbacks, userId, jobId) {
	if(userId == null || jobId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/async/{userId}/jobs/{jobId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "jobId" + "}", utils.toPathValue(jobId));
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
 * Get job resources
 *
 * @param String userId User GUID (required).
 * @param String statusIds Comma separated job status identifiers (required).
 * @param String actions Actions (optional).
 * @param String excludedActions Excluded actions (optional).
 *
 * @return this 
 */
AsyncApi.prototype.GetJobResources = function(callbacks, userId, statusIds, actions, excludedActions) {
	if(userId == null || statusIds == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/async/{userId}/jobs/resources";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (statusIds != null) {
		queryParams['statusIds'] = utils.toPathValue(statusIds);
	}
	if (actions != null) {
		queryParams['actions'] = utils.toPathValue(actions);
	}
	if (excludedActions != null) {
		queryParams['excluded_actions'] = utils.toPathValue(excludedActions);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get job documents
 *
 * @param String userId User GUID (required).
 * @param String jobId Job id or guid (required).
 * @param String format Format (optional).
 *
 * @return this 
 */
AsyncApi.prototype.GetJobDocuments = function(callbacks, userId, jobId, format) {
	if(userId == null || jobId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/async/{userId}/jobs/{jobId}/documents";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "jobId" + "}", utils.toPathValue(jobId));
	// add query parameters
	var queryParams = [];
	if (format != null) {
		queryParams['format'] = utils.toPathValue(format);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Create job
 *
 * @param String userId User GUID (required).
 * @param JobInfo body Job (required).
 *
 * @return this 
 */
AsyncApi.prototype.CreateJob = function(callbacks, userId, body) {
	if(userId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/async/{userId}/jobs";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
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
 * Delete draft job
 *
 * @param String userId User GUID (required).
 * @param String jobGuid Job Guid (required).
 *
 * @return this 
 */
AsyncApi.prototype.DeleteJob = function(callbacks, userId, jobGuid) {
	if(userId == null || jobGuid == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/async/{userId}/jobs/{jobGuid}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "jobGuid" + "}", utils.toPathValue(jobGuid));
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
 * Add job document
 *
 * @param String userId User GUID (required).
 * @param String jobId Job id or guid (required).
 * @param String fileId File GUID (required).
 * @param Boolean checkOwnership Check Document Ownership (required).
 * @param String formats Formats (optional).
 *
 * @return this 
 */
AsyncApi.prototype.AddJobDocument = function(callbacks, userId, jobId, fileId, checkOwnership, formats) {
	if(userId == null || jobId == null || fileId == null || checkOwnership == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/async/{userId}/jobs/{jobId}/files/{fileId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "jobId" + "}", utils.toPathValue(jobId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	// add query parameters
	var queryParams = [];
	if (checkOwnership != null) {
		queryParams['check_ownership'] = utils.toPathValue(checkOwnership);
	}
	if (formats != null) {
		queryParams['out_formats'] = utils.toPathValue(formats);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Delete document from job
 *
 * @param String userId User GUID (required).
 * @param String jobGuid Job Guid (required).
 * @param String documentId Document GUID (required).
 *
 * @return this 
 */
AsyncApi.prototype.DeleteJobDocument = function(callbacks, userId, jobGuid, documentId) {
	if(userId == null || jobGuid == null || documentId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/async/{userId}/jobs/{jobGuid}/documents/{documentId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "jobGuid" + "}", utils.toPathValue(jobGuid));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
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
 * Add job document url
 *
 * @param String userId User GUID (required).
 * @param String jobId Job id (required).
 * @param String absoluteUrl Absolute Url (required).
 * @param String formats Formats (optional).
 *
 * @return this 
 */
AsyncApi.prototype.AddJobDocumentUrl = function(callbacks, userId, jobId, absoluteUrl, formats) {
	if(userId == null || jobId == null || absoluteUrl == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/async/{userId}/jobs/{jobId}/urls";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "jobId" + "}", utils.toPathValue(jobId));
	// add query parameters
	var queryParams = [];
	if (absoluteUrl != null) {
		queryParams['absolute_url'] = utils.toPathValue(absoluteUrl);
	}
	if (formats != null) {
		queryParams['out_formats'] = utils.toPathValue(formats);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Update job
 *
 * @param String userId User GUID (required).
 * @param String jobId Job id or Guid (required).
 * @param JobInfo body Job (required).
 *
 * @return this 
 */
AsyncApi.prototype.UpdateJob = function(callbacks, userId, jobId, body) {
	if(userId == null || jobId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/async/{userId}/jobs/{jobId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "jobId" + "}", utils.toPathValue(jobId));
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
 * Get jobs
 *
 * @param String userId User GUID (required).
 * @param String pageIndex Page Index (optional).
 * @param String pageSize Page Size (optional).
 * @param String Date Date (optional).
 * @param String statusIds Comma separated status identifiers (optional).
 * @param String actions Actions (optional).
 * @param String excludedActions Excluded actions (optional).
 *
 * @return this 
 */
AsyncApi.prototype.GetJobs = function(callbacks, userId, pageIndex, pageSize, Date, statusIds, actions, excludedActions) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/async/{userId}/jobs";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (pageIndex != null) {
		queryParams['page'] = utils.toPathValue(pageIndex);
	}
	if (pageSize != null) {
		queryParams['count'] = utils.toPathValue(pageSize);
	}
	if (Date != null) {
		queryParams['date'] = utils.toPathValue(Date);
	}
	if (statusIds != null) {
		queryParams['statusIds'] = utils.toPathValue(statusIds);
	}
	if (actions != null) {
		queryParams['actions'] = utils.toPathValue(actions);
	}
	if (excludedActions != null) {
		queryParams['excluded_actions'] = utils.toPathValue(excludedActions);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get jobs documents
 *
 * @param String userId User GUID (required).
 * @param String pageIndex Page Index (optional).
 * @param String pageSize Page Size (optional).
 * @param String actions Actions (optional).
 * @param String excludedActions Excluded actions (optional).
 * @param String orderBy Order by (optional).
 * @param Boolean orderAsc Order asc (optional).
 *
 * @return this 
 */
AsyncApi.prototype.GetJobsDocuments = function(callbacks, userId, pageIndex, pageSize, actions, excludedActions, orderBy, orderAsc) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/async/{userId}/jobs/documents";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (pageIndex != null) {
		queryParams['page'] = utils.toPathValue(pageIndex);
	}
	if (pageSize != null) {
		queryParams['count'] = utils.toPathValue(pageSize);
	}
	if (actions != null) {
		queryParams['actions'] = utils.toPathValue(actions);
	}
	if (excludedActions != null) {
		queryParams['excluded_actions'] = utils.toPathValue(excludedActions);
	}
	if (orderBy != null) {
		queryParams['order_by'] = utils.toPathValue(orderBy);
	}
	if (orderAsc != null) {
		queryParams['order_asc'] = utils.toPathValue(orderAsc);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Convert
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param String targetType Target type (optional).
 * @param String emailResults Email results (optional).
 * @param String description Description (optional).
 * @param Boolean printScript Print (optional).
 * @param String callbackUrl Callback url (optional).
 * @param Boolean checkDocumentOwnership Check Document Ownership (optional).
 *
 * @return this 
 */
AsyncApi.prototype.Convert = function(callbacks, userId, fileId, targetType, emailResults, description, printScript, callbackUrl, checkDocumentOwnership) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/async/{userId}/files/{fileId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	// add query parameters
	var queryParams = [];
	if (targetType != null) {
		queryParams['new_type'] = utils.toPathValue(targetType);
	}
	if (emailResults != null) {
		queryParams['email_results'] = utils.toPathValue(emailResults);
	}
	if (description != null) {
		queryParams['new_description'] = utils.toPathValue(description);
	}
	if (printScript != null) {
		queryParams['print_script'] = utils.toPathValue(printScript);
	}
	if (callbackUrl != null) {
		queryParams['callback'] = utils.toPathValue(callbackUrl);
	}
	if (checkDocumentOwnership != null) {
		queryParams['checkDocumentOwnership'] = utils.toPathValue(checkDocumentOwnership);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

module.exports = AsyncApi;
