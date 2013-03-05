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
 * @this DocApi
 * @param {ApiClient} apiClient The ApiClient instance (required)
 * @param {string} basePath The base path of API server (optional)
 */
var DocApi = function(apiClient, basePath) {
	this.apiClient = apiClient;
	this.basePath = (basePath || "https://api.groupdocs.com/v2.0");
};

/**
 * View Document
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param String pageNumber Page Number (optional).
 * @param String pageCount Page Count (optional).
 * @param String width Width (optional).
 * @param String quality Quality (optional).
 * @param String usePdf Use Pdf (optional).
 *
 * @return this 
 */
DocApi.prototype.ViewDocument = function(callbacks, userId, fileId, pageNumber, pageCount, width, quality, usePdf) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/thumbnails";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	// add query parameters
	var queryParams = [];
	if (pageNumber != null) {
		queryParams['page_number'] = utils.toPathValue(pageNumber);
	}
	if (pageCount != null) {
		queryParams['page_count'] = utils.toPathValue(pageCount);
	}
	if (width != null) {
		queryParams['width'] = utils.toPathValue(width);
	}
	if (quality != null) {
		queryParams['quality'] = utils.toPathValue(quality);
	}
	if (usePdf != null) {
		queryParams['use_pdf'] = utils.toPathValue(usePdf);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * View Document
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param String pageNumber Page Number (optional).
 * @param String pageCount Page Count (optional).
 *
 * @return this 
 */
DocApi.prototype.ViewDocumentAsHtml = function(callbacks, userId, fileId, pageNumber, pageCount) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/htmlRepresentations";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	// add query parameters
	var queryParams = [];
	if (pageNumber != null) {
		queryParams['page_number'] = utils.toPathValue(pageNumber);
	}
	if (pageCount != null) {
		queryParams['page_count'] = utils.toPathValue(pageCount);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get Document Views
 *
 * @param String userId User GUID (required).
 * @param String startIndex A historical view entry to start from. Historical entries are sorted from the recent to old ones (optional).
 * @param String pageSize The total number of requested entries. If pageSize is equal to -1, all available entries will be returned (optional).
 *
 * @return this 
 */
DocApi.prototype.GetDocumentViews = function(callbacks, userId, startIndex, pageSize) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/views";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (startIndex != null) {
		queryParams['page_index'] = utils.toPathValue(startIndex);
	}
	if (pageSize != null) {
		queryParams['page_size'] = utils.toPathValue(pageSize);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Share document
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param List[String] body Sharers (required).
 *
 * @return this 
 */
DocApi.prototype.ShareDocument = function(callbacks, userId, fileId, body) {
	if(userId == null || fileId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/sharers";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
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
 * Unshare document
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 *
 * @return this 
 */
DocApi.prototype.UnshareDocument = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/sharers";

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
 * Get folder sharers
 *
 * @param String userId User GUID (required).
 * @param String folderId Folder Id (required).
 *
 * @return this 
 */
DocApi.prototype.GetFolderSharers = function(callbacks, userId, folderId) {
	if(userId == null || folderId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/folders/{folderId}/sharers";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "folderId" + "}", utils.toPathValue(folderId));
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
 * Share folder
 *
 * @param String userId User GUID (required).
 * @param String folderId Folder Id (required).
 * @param List[String] body Sharers (required).
 *
 * @return this 
 */
DocApi.prototype.ShareFolder = function(callbacks, userId, folderId, body) {
	if(userId == null || folderId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/folders/{folderId}/sharers";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "folderId" + "}", utils.toPathValue(folderId));
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
 * Unshare folder
 *
 * @param String userId User GUID (required).
 * @param String folderId Folder Id (required).
 *
 * @return this 
 */
DocApi.prototype.UnshareFolder = function(callbacks, userId, folderId) {
	if(userId == null || folderId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/folders/{folderId}/sharers";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "folderId" + "}", utils.toPathValue(folderId));
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
 * Set document access mode
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param String mode Mode (optional).
 *
 * @return this 
 */
DocApi.prototype.SetDocumentAccessMode = function(callbacks, userId, fileId, mode) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/accessinfo";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	// add query parameters
	var queryParams = [];
	if (mode != null) {
		queryParams['mode'] = utils.toPathValue(mode);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get document access info
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 *
 * @return this 
 */
DocApi.prototype.GetDocumentAccessInfo = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/accessinfo";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
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
 * Get document metadata
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 *
 * @return this 
 */
DocApi.prototype.GetDocumentMetadata = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/metadata";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
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
 * Returns document metadata
 *
 * @param String userId User GUID (required).
 * @param String path File path to return metadata for (required).
 *
 * @return this 
 */
DocApi.prototype.GetDocumentMetadataByPath = function(callbacks, userId, path) {
	if(userId == null || path == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{path}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "path" + "}", utils.toPathValue(path));
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
 * Set document user status
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param String status Status (required).
 *
 * @return this 
 */
DocApi.prototype.SetDocumentUserStatus = function(callbacks, userId, fileId, status) {
	if(userId == null || fileId == null || status == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/sharer";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	// add query parameters
	var queryParams = [];
	if (status != null) {
		queryParams['status'] = utils.toPathValue(status);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get shared documents
 *
 * @param String userId User GUID (required).
 * @param String sharesTypes Shares types (optional).
 * @param String pageIndex Page index (optional).
 * @param String pageSize Page size (optional).
 * @param String orderBy Order by (optional).
 * @param Boolean orderAsc Order asc (optional).
 *
 * @return this 
 */
DocApi.prototype.GetSharedDocuments = function(callbacks, userId, sharesTypes, pageIndex, pageSize, orderBy, orderAsc) {
	if(userId == null || sharesTypes == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/shares/{sharesTypes}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "sharesTypes" + "}", utils.toPathValue(sharesTypes));
	// add query parameters
	var queryParams = [];
	if (pageIndex != null) {
		queryParams['page_index'] = utils.toPathValue(pageIndex);
	}
	if (pageSize != null) {
		queryParams['page_size'] = utils.toPathValue(pageSize);
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
 * Get template fields
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param Boolean includeGeometry Include geometry (optional).
 *
 * @return this 
 */
DocApi.prototype.GetTemplateFields = function(callbacks, userId, fileId, includeGeometry) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/fields";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	// add query parameters
	var queryParams = [];
	if (includeGeometry != null) {
		queryParams['include_geometry'] = utils.toPathValue(includeGeometry);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get document formats
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 *
 * @return this 
 */
DocApi.prototype.GetDocumentFormats = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/formats";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
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
 * Returns a stream of bytes representing a particular document page image.
 *
 * @param String userId GroupDocs user global unique identifier. (required).
 * @param String fileId Document global unique identifier. (required).
 * @param Number pageNumber Document page number to get image for. (required).
 * @param String dimension Image dimension in format '&lt;width&gt;x&lt;height&gt;' (one or both values can be omitted). (required).
 * @param Number quality Image qualiry in range 1-100. (optional).
 * @param Boolean usePdf A flag indicating whether a document should be converted to PDF format before generating the image. (optional).
 * @param Boolean expiresOn The date and time in milliseconds since epoch the URL expires. (optional).
 *
 * @return this 
 */
DocApi.prototype.GetDocumentPageImage = function(callbacks, userId, fileId, pageNumber, dimension, quality, usePdf, expiresOn) {
	if(userId == null || fileId == null || pageNumber == null || dimension == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/pages/{pageNumber}/images/{dimension}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	resourcePath = resourcePath.replace("{" + "pageNumber" + "}", utils.toPathValue(pageNumber));
	resourcePath = resourcePath.replace("{" + "dimension" + "}", utils.toPathValue(dimension));
	// add query parameters
	var queryParams = [];
	if (quality != null) {
		queryParams['quality'] = utils.toPathValue(quality);
	}
	if (usePdf != null) {
		queryParams['use_pdf'] = utils.toPathValue(usePdf);
	}
	if (expiresOn != null) {
		queryParams['expires'] = utils.toPathValue(expiresOn);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.prepareToCallAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Returns an HTML representantion of a particular document page.
 *
 * @param String userId GroupDocs user global unique identifier. (required).
 * @param String fileId Document global unique identifier. (required).
 * @param Number pageNumber Document page number to get image for. (required).
 * @param Boolean expiresOn The date and time in milliseconds since epoch the URL expires. (optional).
 *
 * @return this 
 */
DocApi.prototype.GetDocumentPageHtml = function(callbacks, userId, fileId, pageNumber, expiresOn) {
	if(userId == null || fileId == null || pageNumber == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/pages/{pageNumber}/htmlRepresentations";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	resourcePath = resourcePath.replace("{" + "pageNumber" + "}", utils.toPathValue(pageNumber));
	// add query parameters
	var queryParams = [];
	if (expiresOn != null) {
		queryParams['expires'] = utils.toPathValue(expiresOn);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.prepareToCallAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Returns a list of URLs pointing to document page images.
 *
 * @param String userId GroupDocs user global unique identifier. (required).
 * @param String fileId Document global unique identifier. (required).
 * @param Number firstPage Document page number to start from. (optional).
 * @param Number pageCount Page count to return URLs for. (optional).
 * @param String dimension Image dimension in format '&lt;width&gt;x&lt;height&gt;' (one or both values can be omitted). (required).
 * @param Number quality Image qualiry in range 1-100. (optional).
 * @param Boolean usePdf A flag indicating whether a document should be converted to PDF format before generating the image. (optional).
 * @param String token A document viewer session token returned by the View Document request. (optional).
 *
 * @return this 
 */
DocApi.prototype.GetDocumentPagesImageUrls = function(callbacks, userId, fileId, firstPage, pageCount, dimension, quality, usePdf, token) {
	if(userId == null || fileId == null || dimension == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/pages/images/{dimension}/urls";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	resourcePath = resourcePath.replace("{" + "dimension" + "}", utils.toPathValue(dimension));
	// add query parameters
	var queryParams = [];
	if (firstPage != null) {
		queryParams['first_page'] = utils.toPathValue(firstPage);
	}
	if (pageCount != null) {
		queryParams['page_count'] = utils.toPathValue(pageCount);
	}
	if (quality != null) {
		queryParams['quality'] = utils.toPathValue(quality);
	}
	if (usePdf != null) {
		queryParams['use_pdf'] = utils.toPathValue(usePdf);
	}
	if (token != null) {
		queryParams['token'] = utils.toPathValue(token);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Returns a list of URLs pointing to document page HTML representations.
 *
 * @param String userId GroupDocs user global unique identifier. (required).
 * @param String fileId Document global unique identifier. (required).
 * @param Number firstPage Document page number to start from. (optional).
 * @param Number pageCount Page count to return URLs for. (optional).
 *
 * @return this 
 */
DocApi.prototype.GetDocumentPagesHtmlUrls = function(callbacks, userId, fileId, firstPage, pageCount) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/pages/htmlRepresentationUrls";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	// add query parameters
	var queryParams = [];
	if (firstPage != null) {
		queryParams['first_page'] = utils.toPathValue(firstPage);
	}
	if (pageCount != null) {
		queryParams['page_count'] = utils.toPathValue(pageCount);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Locks a document for editing and returns editing metadata.
 *
 * @param String userId GroupDocs user global unique identifier. (required).
 * @param String fileId Document global unique identifier. (required).
 *
 * @return this 
 */
DocApi.prototype.GetEditLock = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/editlock";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
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
 * Removes edit lock for a document and replaces the document with its edited copy.
 *
 * @param String userId GroupDocs user global unique identifier. (required).
 * @param String fileId Document global unique identifier. (required).
 * @param String lockId Lock Id. (required).
 *
 * @return this 
 */
DocApi.prototype.RemoveEditLock = function(callbacks, userId, fileId, lockId) {
	if(userId == null || fileId == null || lockId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/editlock";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	// add query parameters
	var queryParams = [];
	if (lockId != null) {
		queryParams['lockId'] = utils.toPathValue(lockId);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "DELETE", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Returns tags assigned to the document.
 *
 * @param String userId GroupDocs user global unique identifier. (required).
 * @param String fileId Document global unique identifier. (required).
 *
 * @return this 
 */
DocApi.prototype.GetDocumentTags = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/tags";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
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
 * Assign tags to the document.
 *
 * @param String userId GroupDocs user global unique identifier. (required).
 * @param String fileId Document global unique identifier. (required).
 *
 * @return this 
 */
DocApi.prototype.SetDocumentTags = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/tags";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
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
 * Removes tags assigned to the document.
 *
 * @param String userId GroupDocs user global unique identifier. (required).
 * @param String fileId Document global unique identifier. (required).
 *
 * @return this 
 */
DocApi.prototype.RemoveDocumentTags = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/doc/{userId}/files/{fileId}/tags";

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

module.exports = DocApi;
