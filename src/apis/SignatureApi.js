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
 * @this SignatureApi
 * @param {ApiClient} apiClient The ApiClient instance (required)
 * @param {string} basePath The base path of API server (optional)
 */
var SignatureApi = function(apiClient, basePath) {
	this.apiClient = apiClient;
	this.basePath = (basePath || "https://api.groupdocs.com/v2.0");
};

/**
 * Get template recources
 *
 * @param String userId User GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureTemplateResources = function(callbacks, userId) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/resources";

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
 * Get signature fields
 *
 * @param String userId User GUID (required).
 * @param String fieldId Filter fields by id (optional).
 *
 * @return this 
 */
SignatureApi.prototype.GetFieldsList = function(callbacks, userId, fieldId) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/fields";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (fieldId != null) {
		queryParams['id'] = utils.toPathValue(fieldId);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Create signature field
 *
 * @param String userId User GUID (required).
 * @param SignatureFieldSettings body Settings of the new field (optional).
 *
 * @return this 
 */
SignatureApi.prototype.CreateSignatureField = function(callbacks, userId, body) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/field";

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
 * Modify signature field
 *
 * @param String userId User GUID (required).
 * @param String fieldId Field GUID (required).
 * @param SignatureFieldSettings body Settings of the field (optional).
 *
 * @return this 
 */
SignatureApi.prototype.ModifySignatureField = function(callbacks, userId, fieldId, body) {
	if(userId == null || fieldId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/fields/{fieldId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
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
 * Delete signature field
 *
 * @param String userId User GUID (required).
 * @param String fieldId Field GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureField = function(callbacks, userId, fieldId) {
	if(userId == null || fieldId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/fields/{fieldId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
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
 * Get contacts
 *
 * @param String userId User GUID (required).
 * @param String page Page number (optional).
 * @param String firstName Filter by firstName (optional).
 * @param String lastName Filter by lastName (optional).
 * @param String email Filter by email (optional).
 * @param String records Records count to be returned (optional).
 *
 * @return this 
 */
SignatureApi.prototype.GetContacts = function(callbacks, userId, page, firstName, lastName, email, records) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/contacts";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (page != null) {
		queryParams['page'] = utils.toPathValue(page);
	}
	if (firstName != null) {
		queryParams['firstName'] = utils.toPathValue(firstName);
	}
	if (lastName != null) {
		queryParams['lastName'] = utils.toPathValue(lastName);
	}
	if (email != null) {
		queryParams['email'] = utils.toPathValue(email);
	}
	if (records != null) {
		queryParams['records'] = utils.toPathValue(records);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Add contact
 *
 * @param String userId User GUID (required).
 * @param SignatureContactSettings body Contact data (required).
 *
 * @return this 
 */
SignatureApi.prototype.AddContact = function(callbacks, userId, body) {
	if(userId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/contact";

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
 * Update contact
 *
 * @param String userId User GUID (required).
 * @param String contactId Contact GUID (required).
 * @param SignatureContactSettings body Contact data (optional).
 *
 * @return this 
 */
SignatureApi.prototype.ModifyContact = function(callbacks, userId, contactId, body) {
	if(userId == null || contactId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/contacts/{contactId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "contactId" + "}", utils.toPathValue(contactId));
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
 * Delete contact
 *
 * @param String userId User GUID (required).
 * @param String contactId Contact GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteContact = function(callbacks, userId, contactId) {
	if(userId == null || contactId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/contacts/{contactId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "contactId" + "}", utils.toPathValue(contactId));
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
 * Import contacts
 *
 * @param String userId User GUID (required).
 * @param List[SignatureContactSettings] body Array of SignatureContactSettings (optional).
 *
 * @return this 
 */
SignatureApi.prototype.ImportContacts = function(callbacks, userId, body) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/contacts";

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
 * Get user predefined lists
 *
 * @param String userId User GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignaturePredefinedLists = function(callbacks, userId) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/lists";

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
 * Add predefined list
 *
 * @param String userId User GUID (required).
 * @param SignaturePredefinedListSettings body List data (required).
 *
 * @return this 
 */
SignatureApi.prototype.AddPredefinedList = function(callbacks, userId, body) {
	if(userId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/list";

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
 * Delete predefined list
 *
 * @param String userId User GUID (required).
 * @param String listId List GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeletePredefinedList = function(callbacks, userId, listId) {
	if(userId == null || listId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/lists/{listId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "listId" + "}", utils.toPathValue(listId));
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
 * Get signature roles
 *
 * @param String userId User GUID (required).
 * @param String id Filter roles by id (optional).
 *
 * @return this 
 */
SignatureApi.prototype.GetRolesList = function(callbacks, userId, id) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/roles";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (id != null) {
		queryParams['id'] = utils.toPathValue(id);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Create user signature
 *
 * @param String userId User GUID (required).
 * @param String name Signature name (required).
 * @param SignatureSignatureSettings body Settings of the field (optional).
 *
 * @return this 
 */
SignatureApi.prototype.CreateSignature = function(callbacks, userId, name, body) {
	if(userId == null || name == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/signature";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (name != null) {
		queryParams['name'] = utils.toPathValue(name);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Delete user signature
 *
 * @param String userId User GUID (required).
 * @param String signatureId Signature GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignature = function(callbacks, userId, signatureId) {
	if(userId == null || signatureId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/signatures/{signatureId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "signatureId" + "}", utils.toPathValue(signatureId));
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
 * Get user signatures
 *
 * @param String userId User GUID (required).
 * @param Number page Show records for page number (optional).
 * @param String name Filter by signature name (optional).
 * @param Number records Show records count (optional).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatures = function(callbacks, userId, page, name, records) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/signatures";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (page != null) {
		queryParams['page'] = utils.toPathValue(page);
	}
	if (name != null) {
		queryParams['name'] = utils.toPathValue(name);
	}
	if (records != null) {
		queryParams['records'] = utils.toPathValue(records);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get templates
 *
 * @param String userId User GUID (required).
 * @param String page Page number (optional).
 * @param String documentGuid Fitler templates by document originalMD5 (optional).
 * @param String recipientName Filter templates by recipient nickname (optional).
 * @param String name Filter templates by signatureTemplate name (optional).
 * @param String records Records count (optional).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureTemplates = function(callbacks, userId, page, documentGuid, recipientName, name, records) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (page != null) {
		queryParams['page'] = utils.toPathValue(page);
	}
	if (documentGuid != null) {
		queryParams['documentGuid'] = utils.toPathValue(documentGuid);
	}
	if (recipientName != null) {
		queryParams['recipientName'] = utils.toPathValue(recipientName);
	}
	if (name != null) {
		queryParams['name'] = utils.toPathValue(name);
	}
	if (records != null) {
		queryParams['records'] = utils.toPathValue(records);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get template
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureTemplate = function(callbacks, userId, templateId) {
	if(userId == null || templateId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
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
 * Create template
 *
 * @param String userId User GUID (required).
 * @param String name Template name (optional).
 * @param String templateId Template GUID of the template that will be used to create the new template (optional).
 * @param SignatureTemplateSettings body Settings of the template (optional).
 * @param String envelopetId Envelope GUID of the envelope that will be used to create the new template (required).
 *
 * @return this 
 */
SignatureApi.prototype.CreateSignatureTemplate = function(callbacks, userId, name, templateId, body, envelopetId) {
	if(userId == null || envelopetId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/template";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (name != null) {
		queryParams['name'] = utils.toPathValue(name);
	}
	if (templateId != null) {
		queryParams['templateId'] = utils.toPathValue(templateId);
	}
	if (envelopetId != null) {
		queryParams['envelopetId'] = utils.toPathValue(envelopetId);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Modify template
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 * @param SignatureTemplateSettings body Settings of the template (optional).
 *
 * @return this 
 */
SignatureApi.prototype.ModifySignatureTemplate = function(callbacks, userId, templateId, body) {
	if(userId == null || templateId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
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
 * Rename template
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 * @param String name New template name (required).
 *
 * @return this 
 */
SignatureApi.prototype.RenameSignatureTemplate = function(callbacks, userId, templateId, name) {
	if(userId == null || templateId == null || name == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
	// add query parameters
	var queryParams = [];
	if (name != null) {
		queryParams['name'] = utils.toPathValue(name);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Delete template
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureTemplate = function(callbacks, userId, templateId) {
	if(userId == null || templateId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
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
 * Add recipient to the template
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 * @param String nickname Nickname of the recipient (required).
 * @param String roleId Role GUID (required).
 * @param String order Display order of the recipient (optional).
 *
 * @return this 
 */
SignatureApi.prototype.AddSignatureTemplateRecipient = function(callbacks, userId, templateId, nickname, roleId, order) {
	if(userId == null || templateId == null || nickname == null || roleId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}/recipient";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
	// add query parameters
	var queryParams = [];
	if (nickname != null) {
		queryParams['nickname'] = utils.toPathValue(nickname);
	}
	if (roleId != null) {
		queryParams['role'] = utils.toPathValue(roleId);
	}
	if (order != null) {
		queryParams['order'] = utils.toPathValue(order);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get template recipients
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureTemplateRecipients = function(callbacks, userId, templateId) {
	if(userId == null || templateId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}/recipients";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
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
 * Remove recipient from template
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 * @param String recipientId Recipient GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureTemplateRecipient = function(callbacks, userId, templateId, recipientId) {
	if(userId == null || templateId == null || recipientId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}/recipients/{recipientId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
	resourcePath = resourcePath.replace("{" + "recipientId" + "}", utils.toPathValue(recipientId));
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
 * Update template recipient
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 * @param String recipientId Recipient GUID (required).
 * @param String nickname Nickname of the recipient (required).
 * @param String roleId Role GUID (required).
 * @param String order Display order of the recipient (optional).
 *
 * @return this 
 */
SignatureApi.prototype.ModifySignatureTemplateRecipient = function(callbacks, userId, templateId, recipientId, nickname, roleId, order) {
	if(userId == null || templateId == null || recipientId == null || nickname == null || roleId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}/recipient/{recipientId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
	resourcePath = resourcePath.replace("{" + "recipientId" + "}", utils.toPathValue(recipientId));
	// add query parameters
	var queryParams = [];
	if (nickname != null) {
		queryParams['nickname'] = utils.toPathValue(nickname);
	}
	if (roleId != null) {
		queryParams['role'] = utils.toPathValue(roleId);
	}
	if (order != null) {
		queryParams['order'] = utils.toPathValue(order);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Add document to template
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 * @param String documentId Document GUID (required).
 * @param String order Display order of the document (optional).
 *
 * @return this 
 */
SignatureApi.prototype.AddSignatureTemplateDocument = function(callbacks, userId, templateId, documentId, order) {
	if(userId == null || templateId == null || documentId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}/document/{documentId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	// add query parameters
	var queryParams = [];
	if (order != null) {
		queryParams['order'] = utils.toPathValue(order);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get documents in template
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureTemplateDocuments = function(callbacks, userId, templateId) {
	if(userId == null || templateId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}/documents";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
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
 * Remove document from template
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 * @param String documentId Document GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureTemplateDocument = function(callbacks, userId, templateId, documentId) {
	if(userId == null || templateId == null || documentId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}/documents/{documentId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
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
 * Add signature template field
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 * @param String documentId Document GUID (required).
 * @param String recipientId Recipient GUID (required).
 * @param String fieldId Field GUID (required).
 * @param SignatureTemplateFieldSettings body Settings of the field (optional).
 *
 * @return this 
 */
SignatureApi.prototype.AddSignatureTemplateField = function(callbacks, userId, templateId, documentId, recipientId, fieldId, body) {
	if(userId == null || templateId == null || documentId == null || recipientId == null || fieldId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}/documents/{documentId}/recipient/{recipientId}/field/{fieldId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	resourcePath = resourcePath.replace("{" + "recipientId" + "}", utils.toPathValue(recipientId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
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
 * Assign signature template field
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 * @param String documentId Document GUID (required).
 * @param String fieldId Field GUID (required).
 * @param SignatureTemplateAssignFieldSettings body Settings of the field (optional).
 *
 * @return this 
 */
SignatureApi.prototype.AssignSignatureTemplateField = function(callbacks, userId, templateId, documentId, fieldId, body) {
	if(userId == null || templateId == null || documentId == null || fieldId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}/documents/{documentId}/field/{fieldId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
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
 * Modify signature template field
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 * @param String documentId Document GUID (required).
 * @param String fieldId Field GUID (required).
 * @param SignatureTemplateFieldSettings body Settings of the field (optional).
 *
 * @return this 
 */
SignatureApi.prototype.ModifySignatureTemplateField = function(callbacks, userId, templateId, documentId, fieldId, body) {
	if(userId == null || templateId == null || documentId == null || fieldId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}/documents/{documentId}/field/{fieldId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
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
 * Delete signature template field location
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 * @param String fieldId Field GUID (required).
 * @param String locationId Field location GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureTemplateFieldLocation = function(callbacks, userId, templateId, fieldId, locationId) {
	if(userId == null || templateId == null || fieldId == null || locationId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}/fields/{fieldId}/locations/{locationId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
	resourcePath = resourcePath.replace("{" + "locationId" + "}", utils.toPathValue(locationId));
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
 * Modify signature template field location
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 * @param String documentId Document GUID (required).
 * @param String recipientId Recipient GUID (required).
 * @param String fieldId Field GUID (required).
 * @param String locationId Field location GUID (required).
 * @param SignatureTemplateFieldLocationSettings body Settings of the field location (optional).
 *
 * @return this 
 */
SignatureApi.prototype.ModifySignatureTemplateFieldLocation = function(callbacks, userId, templateId, documentId, recipientId, fieldId, locationId, body) {
	if(userId == null || templateId == null || documentId == null || recipientId == null || fieldId == null || locationId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}/documents/{documentId}/recipient/{recipientId}/fields/{fieldId}/locations/{locationId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	resourcePath = resourcePath.replace("{" + "recipientId" + "}", utils.toPathValue(recipientId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
	resourcePath = resourcePath.replace("{" + "locationId" + "}", utils.toPathValue(locationId));
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
 * Get template fields
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 * @param String documentId Document GUID (required).
 * @param String recipientId Recipient GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureTemplateFields = function(callbacks, userId, templateId, documentId, recipientId) {
	if(userId == null || templateId == null || documentId == null || recipientId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}/fields";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
	// add query parameters
	var queryParams = [];
	if (documentId != null) {
		queryParams['document'] = utils.toPathValue(documentId);
	}
	if (recipientId != null) {
		queryParams['recipient'] = utils.toPathValue(recipientId);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Delete signature template field
 *
 * @param String userId User GUID (required).
 * @param String templateId Template GUID (required).
 * @param String fieldId Field GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureTemplateField = function(callbacks, userId, templateId, fieldId) {
	if(userId == null || templateId == null || fieldId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/templates/{templateId}/fields/{fieldId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
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
 * Restart expired envelope
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.RestartExpiredSignatureEnvelope = function(callbacks, userId, envelopeId) {
	if(userId == null || envelopeId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/restart";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
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
 * Send envelope
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param stream body Webhook Callback Url (optional).
 *
 * @return this 
 */
SignatureApi.prototype.SignatureEnvelopeSend = function(callbacks, userId, envelopeId, body) {
	if(userId == null || envelopeId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/send";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
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
 * Sign envelope
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String recipientId Recipient GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.SignEnvelope = function(callbacks, userId, envelopeId, recipientId) {
	if(userId == null || envelopeId == null || recipientId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/recipient/{recipientId}/sign";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	resourcePath = resourcePath.replace("{" + "recipientId" + "}", utils.toPathValue(recipientId));
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
 * Get signature envelopes
 *
 * @param String userId User GUID (required).
 * @param String statusId Filter envelopes by statusId (optional).
 * @param Number page Show records for page number (optional).
 * @param String Date Filter envelopes by date (optional).
 * @param String name Filter envelopes by name (optional).
 * @param Number records Show records count (optional).
 * @param String document Filter envelopes by original document md5 checksum (optional).
 * @param String recipient Filter envelopes by recipient email (optional).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureEnvelopes = function(callbacks, userId, statusId, page, Date, name, records, document, recipient) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (statusId != null) {
		queryParams['statusId'] = utils.toPathValue(statusId);
	}
	if (page != null) {
		queryParams['page'] = utils.toPathValue(page);
	}
	if (Date != null) {
		queryParams['date'] = utils.toPathValue(Date);
	}
	if (name != null) {
		queryParams['name'] = utils.toPathValue(name);
	}
	if (records != null) {
		queryParams['records'] = utils.toPathValue(records);
	}
	if (document != null) {
		queryParams['document'] = utils.toPathValue(document);
	}
	if (recipient != null) {
		queryParams['recipient'] = utils.toPathValue(recipient);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get envelope recources
 *
 * @param String userId User GUID (required).
 * @param String statusIds Envelope status identifier - comma separated list (optional).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureEnvelopeResources = function(callbacks, userId, statusIds) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/resources";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (statusIds != null) {
		queryParams['statusIds'] = utils.toPathValue(statusIds);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get signature envelopes where the user is recipient
 *
 * @param String userId User GUID (required).
 * @param String statusId Filter envelopes by statusId (optional).
 * @param Number page Show records for page number (optional).
 * @param Number records Show records count (optional).
 *
 * @return this 
 */
SignatureApi.prototype.GetRecipientSignatureEnvelopes = function(callbacks, userId, statusId, page, records) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/recipient";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (statusId != null) {
		queryParams['statusId'] = utils.toPathValue(statusId);
	}
	if (page != null) {
		queryParams['page'] = utils.toPathValue(page);
	}
	if (records != null) {
		queryParams['records'] = utils.toPathValue(records);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Archive signature form
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.ArchiveSignatureForm = function(callbacks, userId, formId) {
	if(userId == null || formId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}/archive";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
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
 * Complete signature form
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.CompleteSignatureForm = function(callbacks, userId, formId) {
	if(userId == null || formId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}/complete";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
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
 * Create signature form
 *
 * @param String userId User GUID (required).
 * @param String name Form name (optional).
 * @param String templateId A templateGuid of the template which will be used to created the new form (optional).
 * @param Number assemblyId A guid of the assembly which will be used to created the new form (optional).
 * @param SignatureFormSettings body Settings of the new form (optional).
 *
 * @return this 
 */
SignatureApi.prototype.CreateSignatureForm = function(callbacks, userId, name, templateId, assemblyId, body) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/form";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (name != null) {
		queryParams['name'] = utils.toPathValue(name);
	}
	if (templateId != null) {
		queryParams['templateId'] = utils.toPathValue(templateId);
	}
	if (assemblyId != null) {
		queryParams['assemblyId'] = utils.toPathValue(assemblyId);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Delete signature form
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureForm = function(callbacks, userId, formId) {
	if(userId == null || formId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
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
 * Add document in form
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 * @param String documentId Document GUID (required).
 * @param Number order Document order (optional).
 *
 * @return this 
 */
SignatureApi.prototype.AddSignatureFormDocument = function(callbacks, userId, formId, documentId, order) {
	if(userId == null || formId == null || documentId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}/document/{documentId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	// add query parameters
	var queryParams = [];
	if (order != null) {
		queryParams['order'] = utils.toPathValue(order);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Delete document from form
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 * @param String documentId Document GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureFormDocument = function(callbacks, userId, formId, documentId) {
	if(userId == null || formId == null || documentId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}/documents/{documentId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
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
 * Get documents in form
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureFormDocuments = function(callbacks, userId, formId) {
	if(userId == null || formId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}/documents";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
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
 * Add signature field for document in form
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 * @param String documentId Document GUID (required).
 * @param String fieldId Field GUID (required).
 * @param SignatureFormFieldSettings body Settings of the field (optional).
 *
 * @return this 
 */
SignatureApi.prototype.AddSignatureFormField = function(callbacks, userId, formId, documentId, fieldId, body) {
	if(userId == null || formId == null || documentId == null || fieldId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}/documents/{documentId}/field/{fieldId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
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
 * Modify signature form field location
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 * @param String documentId Document GUID (required).
 * @param String fieldId Field GUID (required).
 * @param String locationId Field location GUID (required).
 * @param SignatureFormFieldLocationSettings body Settings of the field location (optional).
 *
 * @return this 
 */
SignatureApi.prototype.ModifySignatureFormFieldLocation = function(callbacks, userId, formId, documentId, fieldId, locationId, body) {
	if(userId == null || formId == null || documentId == null || fieldId == null || locationId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}/documents/{documentId}/fields/{fieldId}/locations/{locationId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
	resourcePath = resourcePath.replace("{" + "locationId" + "}", utils.toPathValue(locationId));
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
 * Remove signature form field location
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 * @param String fieldId Field GUID (required).
 * @param String locationId Field location GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureFormFieldLocation = function(callbacks, userId, formId, fieldId, locationId) {
	if(userId == null || formId == null || fieldId == null || locationId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}/fields/{fieldId}/locations/{locationId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
	resourcePath = resourcePath.replace("{" + "locationId" + "}", utils.toPathValue(locationId));
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
 * Modify signature form field
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 * @param String documentId Document GUID (required).
 * @param String fieldId Field GUID (required).
 * @param SignatureFormFieldSettings body Settings of the field (optional).
 *
 * @return this 
 */
SignatureApi.prototype.ModifySignatureFormField = function(callbacks, userId, formId, documentId, fieldId, body) {
	if(userId == null || formId == null || documentId == null || fieldId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}/documents/{documentId}/field/{fieldId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
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
 * Delete signature form field
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 * @param String fieldId Field GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureFormField = function(callbacks, userId, formId, fieldId) {
	if(userId == null || formId == null || fieldId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}/fields/{fieldId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
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
 * Get form fields for document in form per participant
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 * @param String documentId Document GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureFormFields = function(callbacks, userId, formId, documentId) {
	if(userId == null || formId == null || documentId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}/documents/{documentId}/fields";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
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
 * Get signature form
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureForm = function(callbacks, userId, formId) {
	if(userId == null || formId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
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
 * Modify signature form
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 * @param SignatureFormSettings body Settings of the form (optional).
 *
 * @return this 
 */
SignatureApi.prototype.ModifySignatureForm = function(callbacks, userId, formId, body) {
	if(userId == null || formId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
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
 * Publish signature form
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.PublishSignatureForm = function(callbacks, userId, formId) {
	if(userId == null || formId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}/publish";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
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
 * Rename signature form
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 * @param String name New form name (required).
 *
 * @return this 
 */
SignatureApi.prototype.RenameSignatureForm = function(callbacks, userId, formId, name) {
	if(userId == null || formId == null || name == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
	// add query parameters
	var queryParams = [];
	if (name != null) {
		queryParams['new_name'] = utils.toPathValue(name);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Add signature form fields from template
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 * @param String templateId Template GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.UpdateSignatureFormFromTemplate = function(callbacks, userId, formId, templateId) {
	if(userId == null || formId == null || templateId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}/templates/{templateId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
	resourcePath = resourcePath.replace("{" + "templateId" + "}", utils.toPathValue(templateId));
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
 * Get signature forms
 *
 * @param String userId User GUID (required).
 * @param String statusId Filter forms by statusId (optional).
 * @param Number page Show records for page number (optional).
 * @param String Date Filter forms by date (optional).
 * @param String name Filter forms by name (optional).
 * @param Number records Show records count (optional).
 * @param String documentId Filter forms by document GUID (optional).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureForms = function(callbacks, userId, statusId, page, Date, name, records, documentId) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (statusId != null) {
		queryParams['statusId'] = utils.toPathValue(statusId);
	}
	if (page != null) {
		queryParams['page'] = utils.toPathValue(page);
	}
	if (Date != null) {
		queryParams['date'] = utils.toPathValue(Date);
	}
	if (name != null) {
		queryParams['name'] = utils.toPathValue(name);
	}
	if (records != null) {
		queryParams['records'] = utils.toPathValue(records);
	}
	if (documentId != null) {
		queryParams['documentId'] = utils.toPathValue(documentId);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get form recources
 *
 * @param String userId User GUID (required).
 * @param String statusIds Form status identifier - comma separated list (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureFormResources = function(callbacks, userId, statusIds) {
	if(userId == null || statusIds == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/resources";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (statusIds != null) {
		queryParams['statusIds'] = utils.toPathValue(statusIds);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get signed form documents
 *
 * @param String userId User GUID (required).
 * @param String formId Form GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignedFormDocuments = function(callbacks, userId, formId) {
	if(userId == null || formId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/forms/{formId}/documents/get";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "formId" + "}", utils.toPathValue(formId));
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
 * Add Contact Integration Authorization
 *
 * @param String userId User GUID (required).
 * @param String body Authorization settings (optional).
 *
 * @return this 
 */
SignatureApi.prototype.AddContactIntegration = function(callbacks, userId, body) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/integration";

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
 * Sign document
 *
 * @param String userId User GUID (required).
 * @param SignatureSignDocumentSettings body Settings of the signing document (optional).
 *
 * @return this 
 */
SignatureApi.prototype.SignDocument = function(callbacks, userId, body) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/sign";

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
 * Archive envelope
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.ArchiveSignatureEnvelope = function(callbacks, userId, envelopeId) {
	if(userId == null || envelopeId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/archive";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
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
 * Get envelope audit logs
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetEnvelopeAuditLogs = function(callbacks, userId, envelopeId) {
	if(userId == null || envelopeId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/logs";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
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
 * Create signature envelope
 *
 * @param String userId User GUID (required).
 * @param String name Envelope name (optional).
 * @param SignatureEnvelopeSettings body Settings of the new envelope (optional).
 * @param String templateGuid A templateGuid of the template which will be used to created the new envelope (optional).
 * @param Number envelopeGuid A envelopeGuid of the envelope which will be used to created the new envelope (optional).
 *
 * @return this 
 */
SignatureApi.prototype.CreateSignatureEnvelope = function(callbacks, userId, name, body, templateGuid, envelopeGuid) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelope";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (name != null) {
		queryParams['name'] = utils.toPathValue(name);
	}
	if (templateGuid != null) {
		queryParams['templateGuid'] = utils.toPathValue(templateGuid);
	}
	if (envelopeGuid != null) {
		queryParams['envelopeGuid'] = utils.toPathValue(envelopeGuid);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Decline envelope
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String recipientId Recipient GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeclineEnvelope = function(callbacks, userId, envelopeId, recipientId) {
	if(userId == null || envelopeId == null || recipientId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/recipient/{recipientId}/decline";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	resourcePath = resourcePath.replace("{" + "recipientId" + "}", utils.toPathValue(recipientId));
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
 * Delegate envelope recipient
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String recipientId Recipient GUID (required).
 * @param String recipientEmail Delegated recipient email (required).
 * @param String recipientFirstName Delegated recipient first name (required).
 * @param String recipientLastName Delegated recipient last name (required).
 *
 * @return this 
 */
SignatureApi.prototype.DelegateEnvelopeRecipient = function(callbacks, userId, envelopeId, recipientId, recipientEmail, recipientFirstName, recipientLastName) {
	if(userId == null || envelopeId == null || recipientId == null || recipientEmail == null || recipientFirstName == null || recipientLastName == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/recipient/{recipientId}/delegate";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	resourcePath = resourcePath.replace("{" + "recipientId" + "}", utils.toPathValue(recipientId));
	// add query parameters
	var queryParams = [];
	if (recipientEmail != null) {
		queryParams['email'] = utils.toPathValue(recipientEmail);
	}
	if (recipientFirstName != null) {
		queryParams['firstname'] = utils.toPathValue(recipientFirstName);
	}
	if (recipientLastName != null) {
		queryParams['lastname'] = utils.toPathValue(recipientLastName);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Delete signature envelope
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureEnvelope = function(callbacks, userId, envelopeId) {
	if(userId == null || envelopeId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
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
 * Add document in envelope
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String documentId Document GUID (required).
 * @param Number order Document order (optional).
 *
 * @return this 
 */
SignatureApi.prototype.AddSignatureEnvelopeDocument = function(callbacks, userId, envelopeId, documentId, order) {
	if(userId == null || envelopeId == null || documentId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/document/{documentId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	// add query parameters
	var queryParams = [];
	if (order != null) {
		queryParams['order'] = utils.toPathValue(order);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get signed envelope document
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String documentId Document GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignedEnvelopeDocument = function(callbacks, userId, envelopeId, documentId) {
	if(userId == null || envelopeId == null || documentId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/document/{documentId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
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
 * Delete document from envelope
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String documentId Document GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureEnvelopeDocument = function(callbacks, userId, envelopeId, documentId) {
	if(userId == null || envelopeId == null || documentId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/documents/{documentId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
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
 * Get documents in envelope
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureEnvelopeDocuments = function(callbacks, userId, envelopeId) {
	if(userId == null || envelopeId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/documents";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
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
 * Get signed envelope documents
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignedEnvelopeDocuments = function(callbacks, userId, envelopeId) {
	if(userId == null || envelopeId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/documents/get";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
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
 * Add signature field for document in envelope
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String documentId Document GUID (required).
 * @param String recipientId Recipient GUID (required).
 * @param String fieldId Field GUID (required).
 * @param SignatureEnvelopeFieldSettings body Settings of the field (optional).
 *
 * @return this 
 */
SignatureApi.prototype.AddSignatureEnvelopeField = function(callbacks, userId, envelopeId, documentId, recipientId, fieldId, body) {
	if(userId == null || envelopeId == null || documentId == null || recipientId == null || fieldId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/documents/{documentId}/recipient/{recipientId}/field/{fieldId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	resourcePath = resourcePath.replace("{" + "recipientId" + "}", utils.toPathValue(recipientId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
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
 * Assign signature envelope field
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String documentId Document GUID (required).
 * @param String fieldId Field GUID (required).
 * @param SignatureEnvelopeAssignFieldSettings body Settings of the field (optional).
 *
 * @return this 
 */
SignatureApi.prototype.AssignSignatureEnvelopeField = function(callbacks, userId, envelopeId, documentId, fieldId, body) {
	if(userId == null || envelopeId == null || documentId == null || fieldId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/documents/{documentId}/field/{fieldId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
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
 * Fill envelope field
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String documentId Document GUID (required).
 * @param String recipientId Recipient GUID (required).
 * @param String fieldId Field GUID (required).
 * @param String signatureId SignatureId GUID (optional).
 * @param stream body Data to be placed in field (optional).
 *
 * @return this 
 */
SignatureApi.prototype.FillEnvelopeField = function(callbacks, userId, envelopeId, documentId, recipientId, fieldId, signatureId, body) {
	if(userId == null || envelopeId == null || documentId == null || recipientId == null || fieldId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/documents/{documentId}/recipient/{recipientId}/field/{fieldId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	resourcePath = resourcePath.replace("{" + "recipientId" + "}", utils.toPathValue(recipientId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
	// add query parameters
	var queryParams = [];
	if (signatureId != null) {
		queryParams['signatureId'] = utils.toPathValue(signatureId);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Modify signature envelope field location
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String documentId Document GUID (required).
 * @param String recipientId Recipient GUID (required).
 * @param String fieldId Field GUID (required).
 * @param String locationId Field location GUID (required).
 * @param SignatureEnvelopeFieldLocationSettings body Settings of the field location (optional).
 *
 * @return this 
 */
SignatureApi.prototype.ModifySignatureEnvelopeFieldLocation = function(callbacks, userId, envelopeId, documentId, recipientId, fieldId, locationId, body) {
	if(userId == null || envelopeId == null || documentId == null || recipientId == null || fieldId == null || locationId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/documents/{documentId}/recipient/{recipientId}/fields/{fieldId}/locations/{locationId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	resourcePath = resourcePath.replace("{" + "recipientId" + "}", utils.toPathValue(recipientId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
	resourcePath = resourcePath.replace("{" + "locationId" + "}", utils.toPathValue(locationId));
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
 * Remove signature envelope field location
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String fieldId Field GUID (required).
 * @param String locationId Field location GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureEnvelopeFieldLocation = function(callbacks, userId, envelopeId, fieldId, locationId) {
	if(userId == null || envelopeId == null || fieldId == null || locationId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/fields/{fieldId}/locations/{locationId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
	resourcePath = resourcePath.replace("{" + "locationId" + "}", utils.toPathValue(locationId));
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
 * Modify signature envelope field
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String documentId Document GUID (required).
 * @param String fieldId Field GUID (required).
 * @param SignatureEnvelopeFieldSettings body Settings of the field (optional).
 *
 * @return this 
 */
SignatureApi.prototype.ModifySignatureEnvelopeField = function(callbacks, userId, envelopeId, documentId, fieldId, body) {
	if(userId == null || envelopeId == null || documentId == null || fieldId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/documents/{documentId}/field/{fieldId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	resourcePath = resourcePath.replace("{" + "documentId" + "}", utils.toPathValue(documentId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
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
 * Delete signature envelope field
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String fieldId Field GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureEnvelopeField = function(callbacks, userId, envelopeId, fieldId) {
	if(userId == null || envelopeId == null || fieldId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/fields/{fieldId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	resourcePath = resourcePath.replace("{" + "fieldId" + "}", utils.toPathValue(fieldId));
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
 * Get signature field for document in envelope per recipient
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String documentId Document GUID (optional).
 * @param String recipientId Recipient GUID (optional).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureEnvelopeFields = function(callbacks, userId, envelopeId, documentId, recipientId) {
	if(userId == null || envelopeId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/fields";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	// add query parameters
	var queryParams = [];
	if (documentId != null) {
		queryParams['document'] = utils.toPathValue(documentId);
	}
	if (recipientId != null) {
		queryParams['recipient'] = utils.toPathValue(recipientId);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get signature envelope
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureEnvelope = function(callbacks, userId, envelopeId) {
	if(userId == null || envelopeId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
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
 * Modify signature envelope
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param SignatureEnvelopeSettings body Settings of the envelope (optional).
 *
 * @return this 
 */
SignatureApi.prototype.ModifySignatureEnvelope = function(callbacks, userId, envelopeId, body) {
	if(userId == null || envelopeId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
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
 * Add signature envelope recipient
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String recipientEmail Recipient email (required).
 * @param String recipientFirstName Recipient first name (required).
 * @param String recipientLastName Recipient last name (required).
 * @param Number order Recipient order (optional).
 * @param String role Recipient role id (required).
 *
 * @return this 
 */
SignatureApi.prototype.AddSignatureEnvelopeRecipient = function(callbacks, userId, envelopeId, recipientEmail, recipientFirstName, recipientLastName, order, role) {
	if(userId == null || envelopeId == null || recipientEmail == null || recipientFirstName == null || recipientLastName == null || role == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/recipient";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	// add query parameters
	var queryParams = [];
	if (recipientEmail != null) {
		queryParams['email'] = utils.toPathValue(recipientEmail);
	}
	if (recipientFirstName != null) {
		queryParams['firstname'] = utils.toPathValue(recipientFirstName);
	}
	if (recipientLastName != null) {
		queryParams['lastname'] = utils.toPathValue(recipientLastName);
	}
	if (order != null) {
		queryParams['order'] = utils.toPathValue(order);
	}
	if (role != null) {
		queryParams['role'] = utils.toPathValue(role);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Modify signature envelope recipient
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String recipientId Recipient GUID (required).
 * @param String recipientEmail Recipient email (required).
 * @param String recipientFirstName Recipient first name (required).
 * @param String recipientLastName Recipient last name (required).
 * @param Number order Recipient order (optional).
 * @param String role Recipient role id (required).
 *
 * @return this 
 */
SignatureApi.prototype.ModifySignatureEnvelopeRecipient = function(callbacks, userId, envelopeId, recipientId, recipientEmail, recipientFirstName, recipientLastName, order, role) {
	if(userId == null || envelopeId == null || recipientId == null || recipientEmail == null || recipientFirstName == null || recipientLastName == null || role == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/recipient/{recipientId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	resourcePath = resourcePath.replace("{" + "recipientId" + "}", utils.toPathValue(recipientId));
	// add query parameters
	var queryParams = [];
	if (recipientEmail != null) {
		queryParams['email'] = utils.toPathValue(recipientEmail);
	}
	if (recipientFirstName != null) {
		queryParams['firstname'] = utils.toPathValue(recipientFirstName);
	}
	if (recipientLastName != null) {
		queryParams['lastname'] = utils.toPathValue(recipientLastName);
	}
	if (order != null) {
		queryParams['order'] = utils.toPathValue(order);
	}
	if (role != null) {
		queryParams['role'] = utils.toPathValue(role);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Delete signature envelope recipient
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String recipientId Recipient GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.DeleteSignatureEnvelopeRecipient = function(callbacks, userId, envelopeId, recipientId) {
	if(userId == null || envelopeId == null || recipientId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/recipients/{recipientId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	resourcePath = resourcePath.replace("{" + "recipientId" + "}", utils.toPathValue(recipientId));
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
 * Get signature envelope recipients
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 *
 * @return this 
 */
SignatureApi.prototype.GetSignatureEnvelopeRecipients = function(callbacks, userId, envelopeId) {
	if(userId == null || envelopeId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}/recipients";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
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
 * Rename signature envelope
 *
 * @param String userId User GUID (required).
 * @param String envelopeId Envelope GUID (required).
 * @param String name New envelope name (required).
 *
 * @return this 
 */
SignatureApi.prototype.RenameSignatureEnvelope = function(callbacks, userId, envelopeId, name) {
	if(userId == null || envelopeId == null || name == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/signature/{userId}/envelopes/{envelopeId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "envelopeId" + "}", utils.toPathValue(envelopeId));
	// add query parameters
	var queryParams = [];
	if (name != null) {
		queryParams['name'] = utils.toPathValue(name);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

module.exports = SignatureApi;
