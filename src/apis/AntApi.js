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
 * @this AntApi
 * @param {ApiClient} apiClient The ApiClient instance (required)
 * @param {string} basePath The base path of API server (optional)
 */
var AntApi = function(apiClient, basePath) {
	this.apiClient = apiClient;
	this.basePath = (basePath || "https://api.groupdocs.com/v2.0");
};

/**
 * Create annotation
 *
 * @param String userId User GUID (required).
 * @param String fileId File ID (required).
 * @param AnnotationInfo body annotation (required).
 *
 * @return this 
 */
AntApi.prototype.CreateAnnotation = function(callbacks, userId, fileId, body) {
	if(userId == null || fileId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/files/{fileId}/annotations";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
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
 * Get list of annotations
 *
 * @param String userId User GUID (required).
 * @param String fileId File ID (required).
 *
 * @return this 
 */
AntApi.prototype.ListAnnotations = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/files/{fileId}/annotations";

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
 * Delete annotation
 *
 * @param String userId User GUID (required).
 * @param String annotationId Annotation ID (required).
 *
 * @return this 
 */
AntApi.prototype.DeleteAnnotation = function(callbacks, userId, annotationId) {
	if(userId == null || annotationId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/annotations/{annotationId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "annotationId" + "}", utils.toPathValue(annotationId));
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
 * Create annotation reply
 *
 * @param String userId User GUID (required).
 * @param String annotationId Annotation ID (required).
 * @param AnnotationReplyInfo body Reply (required).
 *
 * @return this 
 */
AntApi.prototype.CreateAnnotationReply = function(callbacks, userId, annotationId, body) {
	if(userId == null || annotationId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/annotations/{annotationId}/replies";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "annotationId" + "}", utils.toPathValue(annotationId));
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
 * Edit annotation reply
 *
 * @param String userId User GUID (required).
 * @param String replyGuid Reply GUID (required).
 * @param String body Message (required).
 *
 * @return this 
 */
AntApi.prototype.EditAnnotationReply = function(callbacks, userId, replyGuid, body) {
	if(userId == null || replyGuid == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/replies/{replyGuid}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "replyGuid" + "}", utils.toPathValue(replyGuid));
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
 * Delete annotation reply
 *
 * @param String userId User GUID (required).
 * @param String replyGuid Reply GUID (required).
 *
 * @return this 
 */
AntApi.prototype.DeleteAnnotationReply = function(callbacks, userId, replyGuid) {
	if(userId == null || replyGuid == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/replies/{replyGuid}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "replyGuid" + "}", utils.toPathValue(replyGuid));
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
 * Get list of annotation replies
 *
 * @param String userId User GUID (required).
 * @param String annotationId Annotation ID (required).
 * @param Number after After (required).
 *
 * @return this 
 */
AntApi.prototype.ListAnnotationReplies = function(callbacks, userId, annotationId, after) {
	if(userId == null || annotationId == null || after == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/annotations/{annotationId}/replies";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "annotationId" + "}", utils.toPathValue(annotationId));
	// add query parameters
	var queryParams = [];
	if (after != null) {
		queryParams['after'] = utils.toPathValue(after);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Set annotation collaborators
 *
 * @param String userId User GUID (required).
 * @param String fileId File ID (required).
 * @param String version Annotation version (required).
 * @param List[String] body Collaborators (optional).
 *
 * @return this 
 */
AntApi.prototype.SetAnnotationCollaborators = function(callbacks, userId, fileId, version, body) {
	if(userId == null || fileId == null || version == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/files/{fileId}/version/{version}/collaborators";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	resourcePath = resourcePath.replace("{" + "version" + "}", utils.toPathValue(version));
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
 * Get list of annotation collaborators
 *
 * @param String userId User GUID (required).
 * @param String fileId File ID (required).
 *
 * @return this 
 */
AntApi.prototype.GetAnnotationCollaborators = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/files/{fileId}/collaborators";

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
 * Add an annotation collaborator
 *
 * @param String userId User GUID (required).
 * @param String fileId File ID (required).
 * @param ReviewerInfo body Reviewer Info (optional).
 *
 * @return this 
 */
AntApi.prototype.AddAnnotationCollaborator = function(callbacks, userId, fileId, body) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/files/{fileId}/collaborators";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
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
 * Delete document reviewer
 *
 * @param String userId User GUID (required).
 * @param String fileId File ID (required).
 * @param String reviewerId Reviewer ID (required).
 *
 * @return this 
 */
AntApi.prototype.DeleteDocumentReviewer = function(callbacks, userId, fileId, reviewerId) {
	if(userId == null || fileId == null || reviewerId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/files/{fileId}/collaborators/{reviewerId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	resourcePath = resourcePath.replace("{" + "reviewerId" + "}", utils.toPathValue(reviewerId));
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
 * Get list of reviewer contacts
 *
 * @param String userId User GUID (required).
 *
 * @return this 
 */
AntApi.prototype.GetReviewerContacts = function(callbacks, userId) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/contacts";

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
 * Get list of reviewer contacts
 *
 * @param String userId User GUID (required).
 * @param List[ReviewerContactInfo] body Reviewer Contacts Array (optional).
 *
 * @return this 
 */
AntApi.prototype.SetReviewerContacts = function(callbacks, userId, body) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/reviewerContacts";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
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
 * Move annotation
 *
 * @param String userId User GUID (required).
 * @param String annotationId Annotation ID (required).
 * @param Point body position (required).
 *
 * @return this 
 */
AntApi.prototype.MoveAnnotation = function(callbacks, userId, annotationId, body) {
	if(userId == null || annotationId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/annotations/{annotationId}/position";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "annotationId" + "}", utils.toPathValue(annotationId));
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
 * Set Annotation Access
 *
 * @param String userId User GUID (required).
 * @param String annotationId Annotation ID (required).
 * @param Number body Annotation Access (required).
 *
 * @return this 
 */
AntApi.prototype.SetAnnotationAccess = function(callbacks, userId, annotationId, body) {
	if(userId == null || annotationId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/annotations/{annotationId}/annotationAccess";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "annotationId" + "}", utils.toPathValue(annotationId));
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
 * Move Annotation Marker
 *
 * @param String userId User GUID (required).
 * @param String annotationId Annotation ID (required).
 * @param Point body position (required).
 *
 * @return this 
 */
AntApi.prototype.MoveAnnotationMarker = function(callbacks, userId, annotationId, body) {
	if(userId == null || annotationId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/annotations/{annotationId}/markerPosition";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "annotationId" + "}", utils.toPathValue(annotationId));
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
 * Set Reviewer Rights
 *
 * @param String userId User GUID (required).
 * @param String fileId File ID (required).
 * @param List[ReviewerInfo] body Collaborators (required).
 *
 * @return this 
 */
AntApi.prototype.SetReviewerRights = function(callbacks, userId, fileId, body) {
	if(userId == null || fileId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/files/{fileId}/reviewerRights";

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
 * Get Shared Link Access Rights
 *
 * @param String userId User GUID (required).
 * @param String fileId File ID (required).
 *
 * @return this 
 */
AntApi.prototype.GetSharedLinkAccessRights = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/files/{fileId}/sharedLinkAccessRights";

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
 * Set Shared Link Access Rights
 *
 * @param String userId User GUID (required).
 * @param String fileId File ID (required).
 * @param Number body Access Rights for the collaborate link (required).
 *
 * @return this 
 */
AntApi.prototype.SetSharedLinkAccessRights = function(callbacks, userId, fileId, body) {
	if(userId == null || fileId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/files/{fileId}/sharedLinkAccessRights";

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
 * Set Session Web Hook Callback Url
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param String body Callback Url (required).
 *
 * @return this 
 */
AntApi.prototype.SetSessionCallbackUrl = function(callbacks, userId, fileId, body) {
	if(userId == null || fileId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/files/{fileId}/sessionCallbackUrl";

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
 * Save Text Of Text Field
 *
 * @param String userId User GUID (required).
 * @param String annotationId Annotation ID (required).
 * @param TextFieldInfo body Text (required).
 *
 * @return this 
 */
AntApi.prototype.SaveTextField = function(callbacks, userId, annotationId, body) {
	if(userId == null || annotationId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/ant/{userId}/annotations/{annotationId}/textFieldInfo";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "annotationId" + "}", utils.toPathValue(annotationId));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

module.exports = AntApi;
