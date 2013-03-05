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
 * @this MgmtApi
 * @param {ApiClient} apiClient The ApiClient instance (required)
 * @param {string} basePath The base path of API server (optional)
 */
var MgmtApi = function(apiClient, basePath) {
	this.apiClient = apiClient;
	this.basePath = (basePath || "https://api.groupdocs.com/v2.0");
};

/**
 * Get user profile
 *
 * @param String userId User GUID (required).
 *
 * @return this 
 */
MgmtApi.prototype.GetUserProfile = function(callbacks, userId) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{userId}/profile";

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
 * Update user profile
 *
 * @param String userId User GUID (required).
 * @param UserInfo body Info (required).
 *
 * @return this 
 */
MgmtApi.prototype.UpdateUserProfile = function(callbacks, userId, body) {
	if(userId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{userId}/profile";

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
 * Change user password
 *
 * @param String userId User GUID (required).
 * @param UserPasswordInfo body Password (required).
 *
 * @return this 
 */
MgmtApi.prototype.ChangeUserPassword = function(callbacks, userId, body) {
	if(userId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{userId}/profile/password";

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
 * Get user profile by reset token
 *
 * @param String callerId Caller GUID (required).
 * @param String token Token (required).
 *
 * @return this 
 */
MgmtApi.prototype.GetUserProfileByResetToken = function(callbacks, callerId, token) {
	if(callerId == null || token == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{callerId}/reset-tokens";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
	// add query parameters
	var queryParams = [];
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
 * Get user profile by verif token
 *
 * @param String callerId Caller GUID (required).
 * @param String token Token (required).
 *
 * @return this 
 */
MgmtApi.prototype.GetUserProfileByVerifToken = function(callbacks, callerId, token) {
	if(callerId == null || token == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{callerId}/verif-tokens";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
	// add query parameters
	var queryParams = [];
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
 * Get user profile by claimed token
 *
 * @param String callerId Caller GUID (required).
 * @param String token Token (required).
 *
 * @return this 
 */
MgmtApi.prototype.GetUserProfileByClaimedToken = function(callbacks, callerId, token) {
	if(callerId == null || token == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{callerId}/claimed-tokens";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
	// add query parameters
	var queryParams = [];
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
 * Get alien user profile
 *
 * @param String callerId Caller GUID (required).
 * @param String userId User GUID (required).
 *
 * @return this 
 */
MgmtApi.prototype.GetAlienUserProfile = function(callbacks, callerId, userId) {
	if(callerId == null || userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{callerId}/users/{userId}/profile";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
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
 * Update alien user profile
 *
 * @param String callerId Caller GUID (required).
 * @param String userId User GUID (required).
 * @param UserInfo body Info (required).
 *
 * @return this 
 */
MgmtApi.prototype.UpdateAlienUserProfile = function(callbacks, callerId, userId, body) {
	if(callerId == null || userId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{callerId}/users/{userId}/profile";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
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
 * Create user
 *
 * @param String callerId Caller GUID (required).
 * @param UserInfo body Payload (required).
 *
 * @return this 
 */
MgmtApi.prototype.CreateUser = function(callbacks, callerId, body) {
	if(callerId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{callerId}/users";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
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
 * Create user login
 *
 * @param String callerId Caller GUID (required).
 * @param String userId User GUID (required).
 * @param String password Password (required).
 *
 * @return this 
 */
MgmtApi.prototype.CreateUserLogin = function(callbacks, callerId, userId, password) {
	if(callerId == null || userId == null || password == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{callerId}/users/{userId}/logins";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (password != null) {
		queryParams['password'] = utils.toPathValue(password);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Change alien user password
 *
 * @param String callerId Caller GUID (required).
 * @param String userId User GUID (required).
 * @param UserPasswordInfo body Password (required).
 *
 * @return this 
 */
MgmtApi.prototype.ChangeAlienUserPassword = function(callbacks, callerId, userId, body) {
	if(callerId == null || userId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{callerId}/users/{userId}/password";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
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
 * Reset user password
 *
 * @param String callerId Caller GUID (required).
 * @param String userId User GUID (required).
 *
 * @return this 
 */
MgmtApi.prototype.ResetUserPassword = function(callbacks, callerId, userId) {
	if(callerId == null || userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{callerId}/users/{userId}/password";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
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
 * Returns user's storage providers.
 *
 * @param String userId User GUID (required).
 *
 * @return this 
 */
MgmtApi.prototype.GetStorageProviders = function(callbacks, userId) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{userId}/storages";

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
 * Adds a new storage provider configuration.
 *
 * @param String userId User GUID (required).
 * @param String provider Storage provider name (required).
 * @param StorageProviderInfo body Storage provider configuration details (required).
 *
 * @return this 
 */
MgmtApi.prototype.AddStorageProvider = function(callbacks, userId, provider, body) {
	if(userId == null || provider == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{userId}/storages/{provider}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "provider" + "}", utils.toPathValue(provider));
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
 * Updates user's storage provider configuration.
 *
 * @param String userId User GUID (required).
 * @param String provider Storage provider name (required).
 * @param StorageProviderInfo body Storage provider configuration details (required).
 *
 * @return this 
 */
MgmtApi.prototype.UpdateStorageProvider = function(callbacks, userId, provider, body) {
	if(userId == null || provider == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{userId}/storages/{provider}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "provider" + "}", utils.toPathValue(provider));
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
 * Returns a list of user roles.
 *
 * @param String userId User GUID (required).
 *
 * @return this 
 */
MgmtApi.prototype.GetRoles = function(callbacks, userId) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{userId}/roles";

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
 * Returns a list of user roles.
 *
 * @param String callerId Caller GUID (required).
 * @param String userId User GUID (required).
 *
 * @return this 
 */
MgmtApi.prototype.GetUserRoles = function(callbacks, callerId, userId) {
	if(callerId == null || userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{callerId}/users/{userId}/roles";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
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
 * Set user roles.
 *
 * @param String callerId Caller GUID (required).
 * @param String userId User GUID (required).
 * @param List[RoleInfo] body A list of user roles (required).
 *
 * @return this 
 */
MgmtApi.prototype.SetUserRoles = function(callbacks, callerId, userId, body) {
	if(callerId == null || userId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{callerId}/users/{userId}/roles";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
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
 * Returns an account information.
 *
 * @param String userId User GUID (required).
 *
 * @return this 
 */
MgmtApi.prototype.GetAccount = function(callbacks, userId) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{userId}/account";

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
 * Closes user's account.
 *
 * @param String userId User global unique identifier (required).
 *
 * @return this 
 */
MgmtApi.prototype.DeleteAccount = function(callbacks, userId) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{userId}/account";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
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
 * Returns account user list.
 *
 * @param String adminId Administrator GUID (required).
 *
 * @return this 
 */
MgmtApi.prototype.GetAccountUsers = function(callbacks, adminId) {
	if(adminId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{adminId}/account/users";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "adminId" + "}", utils.toPathValue(adminId));
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
 * Create or update account user.
 *
 * @param String adminId Administrator GUID (required).
 * @param String userName User name (required).
 * @param UserInfo body User details (required).
 *
 * @return this 
 */
MgmtApi.prototype.UpdateAccountUser = function(callbacks, adminId, userName, body) {
	if(adminId == null || userName == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{adminId}/account/users/{userName}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "adminId" + "}", utils.toPathValue(adminId));
	resourcePath = resourcePath.replace("{" + "userName" + "}", utils.toPathValue(userName));
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
 * Delete account user.
 *
 * @param String adminId Administrator GUID (required).
 * @param String userName User name (required).
 *
 * @return this 
 */
MgmtApi.prototype.DeleteAccountUser = function(callbacks, adminId, userName) {
	if(adminId == null || userName == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{adminId}/account/users/{userName}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "adminId" + "}", utils.toPathValue(adminId));
	resourcePath = resourcePath.replace("{" + "userName" + "}", utils.toPathValue(userName));
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
 * Returns active user embed key.
 *
 * @param String userId User GUID (required).
 * @param String area Application area where the key is (required).
 *
 * @return this 
 */
MgmtApi.prototype.GetUserEmbedKey = function(callbacks, userId, area) {
	if(userId == null || area == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{userId}/embedkey/{area}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "area" + "}", utils.toPathValue(area));
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
 * Returns embed key by GUID.
 *
 * @param String callerId UserId invoked the service (required).
 * @param String guid Key GUID (required).
 *
 * @return this 
 */
MgmtApi.prototype.GetUserEmbedKeyFromGuid = function(callbacks, callerId, guid) {
	if(callerId == null || guid == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{callerId}/embedkey/guid/{guid}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
	resourcePath = resourcePath.replace("{" + "guid" + "}", utils.toPathValue(guid));
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
 * Generates new active user embed key.
 *
 * @param String userId User GUID (required).
 * @param String area Application area where the key is (required).
 *
 * @return this 
 */
MgmtApi.prototype.GenerateKeyForUser = function(callbacks, userId, area) {
	if(userId == null || area == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/mgmt/{userId}/embedkey/new/{area}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "area" + "}", utils.toPathValue(area));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

module.exports = MgmtApi;
