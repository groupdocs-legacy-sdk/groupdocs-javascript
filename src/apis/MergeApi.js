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
 * @this MergeApi
 * @param {ApiClient} apiClient The ApiClient instance (required)
 * @param {string} basePath The base path of API server (optional)
 */
var MergeApi = function(apiClient, basePath) {
	this.apiClient = apiClient;
	this.basePath = (basePath || "https://api.groupdocs.com/v2.0");
};

/**
 * Get questionnaire collectors
 *
 * @param String userId User global unique identifier (required).
 * @param String questionnaireId Questionnaire identifier (required).
 *
 * @return this 
 */
MergeApi.prototype.GetQuestionnaireCollectors = function(callbacks, userId, questionnaireId) {
	if(userId == null || questionnaireId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/{questionnaireId}/collectors";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "questionnaireId" + "}", utils.toPathValue(questionnaireId));
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
 * Returns questionnaire collector
 *
 * @param String userId User global unique identifier (required).
 * @param String collectorId Questionnaire collector global unique identifier (required).
 *
 * @return this 
 */
MergeApi.prototype.GetQuestionnaireCollector = function(callbacks, userId, collectorId) {
	if(userId == null || collectorId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/collectors/{collectorId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "collectorId" + "}", utils.toPathValue(collectorId));
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
 * Add questionnaire collector
 *
 * @param String userId User global unique identifier (required).
 * @param String questionnaireId Questionnaire identifier (required).
 * @param QuestionnaireCollectorInfo body Questionnaire collector to be added (required).
 *
 * @return this 
 */
MergeApi.prototype.AddQuestionnaireCollector = function(callbacks, userId, questionnaireId, body) {
	if(userId == null || questionnaireId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/{questionnaireId}/collectors";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "questionnaireId" + "}", utils.toPathValue(questionnaireId));
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
 * Update questionnaire collector
 *
 * @param String userId User global unique identifier (required).
 * @param String collectorId Questionnaire collector global unique identifier (required).
 * @param QuestionnaireCollectorInfo body Questionnaire collector data (required).
 *
 * @return this 
 */
MergeApi.prototype.UpdateQuestionnaireCollector = function(callbacks, userId, collectorId, body) {
	if(userId == null || collectorId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/collectors/{collectorId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "collectorId" + "}", utils.toPathValue(collectorId));
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
 * Removes questionnaire collector
 *
 * @param String userId User global unique identifier (required).
 * @param String collectorId Questionnaire collector global unique identifier (required).
 *
 * @return this 
 */
MergeApi.prototype.DeleteQuestionnaireCollector = function(callbacks, userId, collectorId) {
	if(userId == null || collectorId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/collectors/{collectorId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "collectorId" + "}", utils.toPathValue(collectorId));
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
 * Get template documents information
 *
 * @param String userId User global unique identifier (required).
 *
 * @return this 
 */
MergeApi.prototype.GetTemplates = function(callbacks, userId) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/templates";

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
 * Get questionnaire fields
 *
 * @param String userId User global unique identifier (required).
 * @param String questionnaireId Questionnaire global unique identifier (required).
 * @param Boolean includeGeometry A flag indicating whether fields coordinates and size should be included into the response. (optional).
 *
 * @return this 
 */
MergeApi.prototype.GetQuestionnaireFields = function(callbacks, userId, questionnaireId, includeGeometry) {
	if(userId == null || questionnaireId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/{questionnaireId}/fields";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "questionnaireId" + "}", utils.toPathValue(questionnaireId));
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
 * Get questionnaire metadata
 *
 * @param String userId User global unique identifier (required).
 * @param String questionnaireId Questionnaire global unique identifier (required).
 *
 * @return this 
 */
MergeApi.prototype.GetQuestionnaireMetadata = function(callbacks, userId, questionnaireId) {
	if(userId == null || questionnaireId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/{questionnaireId}/metadata";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "questionnaireId" + "}", utils.toPathValue(questionnaireId));
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
 * Update questionnaire metadata
 *
 * @param String userId User global unique identifier (required).
 * @param String questionnaireId Questionnaire global unique identifier (required).
 * @param QuestionnaireMetadata body Questionnaire metadata to update (required).
 *
 * @return this 
 */
MergeApi.prototype.UpdateQuestionnaireMetadata = function(callbacks, userId, questionnaireId, body) {
	if(userId == null || questionnaireId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/{questionnaireId}/metadata";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "questionnaireId" + "}", utils.toPathValue(questionnaireId));
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
 * Add job document datasource
 *
 * @param String userId User GUID (required).
 * @param Number jobId Job indetifier (required).
 * @param Number fileId File indetifier (required).
 * @param Number datasourceId Datasource indetifier (required).
 *
 * @return this 
 */
MergeApi.prototype.AddJobDocumentDataSource = function(callbacks, userId, jobId, fileId, datasourceId) {
	if(userId == null || jobId == null || fileId == null || datasourceId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/jobs/{jobId}/files/{fileId}/datasources/{datasourceId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "jobId" + "}", utils.toPathValue(jobId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	resourcePath = resourcePath.replace("{" + "datasourceId" + "}", utils.toPathValue(datasourceId));
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
 * Add job document datasource fields
 *
 * @param String userId User GUID (required).
 * @param String jobId Job id (required).
 * @param String fileId File GUID (required).
 * @param List[DatasourceField] body Fields (required).
 *
 * @return this 
 */
MergeApi.prototype.AddJobDocumentDataSourceFields = function(callbacks, userId, jobId, fileId, body) {
	if(userId == null || jobId == null || fileId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/jobs/{jobId}/files/{fileId}/datasources";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "jobId" + "}", utils.toPathValue(jobId));
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
 * Merge datasource
 *
 * @param String userId User global unique identifier (required).
 * @param String collectorId Collector global unique identifier to fill (required).
 * @param String datasourceId Datasource identifier (required).
 * @param String targetType Filled document type (optional).
 * @param String emailResults Email results (optional).
 *
 * @return this 
 */
MergeApi.prototype.FillQuestionnaire = function(callbacks, userId, collectorId, datasourceId, targetType, emailResults) {
	if(userId == null || collectorId == null || datasourceId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/collectors/{collectorId}/datasources/{datasourceId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "collectorId" + "}", utils.toPathValue(collectorId));
	resourcePath = resourcePath.replace("{" + "datasourceId" + "}", utils.toPathValue(datasourceId));
	// add query parameters
	var queryParams = [];
	if (targetType != null) {
		queryParams['new_type'] = utils.toPathValue(targetType);
	}
	if (emailResults != null) {
		queryParams['email_results'] = utils.toPathValue(emailResults);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Scheduled questionnaire execution fullfilment job
 *
 * @param String userId User global unique identifier (required).
 * @param String executionId Execution global unique identifier to fill (required).
 * @param String datasourceId Datasource identifier (required).
 * @param String targetType Filled document type (optional).
 * @param String emailResults Email results (optional).
 *
 * @return this 
 */
MergeApi.prototype.FillExecution = function(callbacks, userId, executionId, datasourceId, targetType, emailResults) {
	if(userId == null || executionId == null || datasourceId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/executions/{executionId}/datasources/{datasourceId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "executionId" + "}", utils.toPathValue(executionId));
	resourcePath = resourcePath.replace("{" + "datasourceId" + "}", utils.toPathValue(datasourceId));
	// add query parameters
	var queryParams = [];
	if (targetType != null) {
		queryParams['new_type'] = utils.toPathValue(targetType);
	}
	if (emailResults != null) {
		queryParams['email_results'] = utils.toPathValue(emailResults);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Merge datasource
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param String datasourceId Datasource id (required).
 * @param String targetType Target type (optional).
 * @param String emailResults Email results (optional).
 *
 * @return this 
 */
MergeApi.prototype.MergeDatasource = function(callbacks, userId, fileId, datasourceId, targetType, emailResults) {
	if(userId == null || fileId == null || datasourceId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/files/{fileId}/datasources/{datasourceId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	resourcePath = resourcePath.replace("{" + "datasourceId" + "}", utils.toPathValue(datasourceId));
	// add query parameters
	var queryParams = [];
	if (targetType != null) {
		queryParams['new_type'] = utils.toPathValue(targetType);
	}
	if (emailResults != null) {
		queryParams['email_results'] = utils.toPathValue(emailResults);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Merge datasource fields
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param String targetType Target type (optional).
 * @param String emailResults Email results (optional).
 * @param String assemblyName Assembly name (optional).
 * @param List[DatasourceField] body Fields (required).
 *
 * @return this 
 */
MergeApi.prototype.MergeDatasourceFields = function(callbacks, userId, fileId, targetType, emailResults, assemblyName, body) {
	if(userId == null || fileId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/files/{fileId}/datasources";

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
	if (assemblyName != null) {
		queryParams['assembly_name'] = utils.toPathValue(assemblyName);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "POST", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get questionnaire
 *
 * @param String userId User GUID (required).
 * @param String questionnaireId Questionnaire id (required).
 *
 * @return this 
 */
MergeApi.prototype.GetQuestionnaire = function(callbacks, userId, questionnaireId) {
	if(userId == null || questionnaireId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/{questionnaireId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "questionnaireId" + "}", utils.toPathValue(questionnaireId));
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
 * Get questionnaires
 *
 * @param String userId User GUID (required).
 * @param String status Questionnaire status to filter by (optional).
 * @param Number pageNumber Page number to return questionnaires on (optional).
 * @param Number pageSize Number of questionnaires to return (optional).
 *
 * @return this 
 */
MergeApi.prototype.GetQuestionnaires = function(callbacks, userId, status, pageNumber, pageSize) {
	if(userId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (status != null) {
		queryParams['status'] = utils.toPathValue(status);
	}
	if (pageNumber != null) {
		queryParams['page_number'] = utils.toPathValue(pageNumber);
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
 * Create questionnaire
 *
 * @param String userId User GUID (required).
 * @param QuestionnaireInfo body Questionnaire (required).
 *
 * @return this 
 */
MergeApi.prototype.CreateQuestionnaire = function(callbacks, userId, body) {
	if(userId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires";

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
 * Update questionnaire
 *
 * @param String userId User GUID (required).
 * @param String questionnaireId Questionnaire id (required).
 * @param QuestionnaireInfo body Questionnaire (required).
 *
 * @return this 
 */
MergeApi.prototype.UpdateQuestionnaire = function(callbacks, userId, questionnaireId, body) {
	if(userId == null || questionnaireId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/{questionnaireId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "questionnaireId" + "}", utils.toPathValue(questionnaireId));
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
 * Delete questionnaire
 *
 * @param String userId User GUID (required).
 * @param String questionnaireId Questionnaire id (required).
 *
 * @return this 
 */
MergeApi.prototype.DeleteQuestionnaire = function(callbacks, userId, questionnaireId) {
	if(userId == null || questionnaireId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/{questionnaireId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "questionnaireId" + "}", utils.toPathValue(questionnaireId));
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
 * Get document questionnaires
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 *
 * @return this 
 */
MergeApi.prototype.GetDocumentQuestionnaires = function(callbacks, userId, fileId) {
	if(userId == null || fileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/files/{fileId}/questionnaires";

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
 * Create document questionnaire
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param QuestionnaireInfo body Questionnaire (required).
 *
 * @return this 
 */
MergeApi.prototype.CreateDocumentQuestionnaire = function(callbacks, userId, fileId, body) {
	if(userId == null || fileId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/files/{fileId}/questionnaires";

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
 * Add document questionnaire
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param String questionnaireId Questionnaire id (required).
 *
 * @return this 
 */
MergeApi.prototype.AddDocumentQuestionnaire = function(callbacks, userId, fileId, questionnaireId) {
	if(userId == null || fileId == null || questionnaireId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/files/{fileId}/questionnaires/{questionnaireId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	resourcePath = resourcePath.replace("{" + "questionnaireId" + "}", utils.toPathValue(questionnaireId));
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
 * Delete document questionnaire
 *
 * @param String userId User GUID (required).
 * @param String fileId File GUID (required).
 * @param String questionnaireId Questionnaire id (required).
 *
 * @return this 
 */
MergeApi.prototype.DeleteDocumentQuestionnaire = function(callbacks, userId, fileId, questionnaireId) {
	if(userId == null || fileId == null || questionnaireId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/files/{fileId}/questionnaires/{questionnaireId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "fileId" + "}", utils.toPathValue(fileId));
	resourcePath = resourcePath.replace("{" + "questionnaireId" + "}", utils.toPathValue(questionnaireId));
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
 * Add datasource
 *
 * @param String userId User GUID (required).
 * @param Datasource body Datasource (required).
 *
 * @return this 
 */
MergeApi.prototype.AddDataSource = function(callbacks, userId, body) {
	if(userId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/datasources";

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
 * Update datasource
 *
 * @param String userId User GUID (required).
 * @param String datasourceId Datasource id (required).
 * @param Datasource body Datasource (required).
 *
 * @return this 
 */
MergeApi.prototype.UpdateDataSource = function(callbacks, userId, datasourceId, body) {
	if(userId == null || datasourceId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/datasources/{datasourceId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "datasourceId" + "}", utils.toPathValue(datasourceId));
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
 * Update datasource fields
 *
 * @param String userId User GUID (required).
 * @param String datasourceId Datasource id (required).
 * @param Datasource body Datasource (required).
 *
 * @return this 
 */
MergeApi.prototype.UpdateDataSourceFields = function(callbacks, userId, datasourceId, body) {
	if(userId == null || datasourceId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/datasources/{datasourceId}/fields";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "datasourceId" + "}", utils.toPathValue(datasourceId));
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
 * Delete datasource fields
 *
 * @param String userId User GUID (required).
 * @param String datasourceId Datasource id (required).
 *
 * @return this 
 */
MergeApi.prototype.DeleteDataSource = function(callbacks, userId, datasourceId) {
	if(userId == null || datasourceId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/datasources/{datasourceId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "datasourceId" + "}", utils.toPathValue(datasourceId));
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
 * Get datasource
 *
 * @param String userId User GUID (required).
 * @param String datasourceId Datasource id (required).
 * @param String fields Fields (optional).
 *
 * @return this 
 */
MergeApi.prototype.GetDataSource = function(callbacks, userId, datasourceId, fields) {
	if(userId == null || datasourceId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/datasources/{datasourceId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "datasourceId" + "}", utils.toPathValue(datasourceId));
	// add query parameters
	var queryParams = [];
	if (fields != null) {
		queryParams['field'] = utils.toPathValue(fields);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get questionnaire datasources
 *
 * @param String userId User GUID (required).
 * @param String questionnaireId QuestionnaireId id (required).
 * @param Boolean includeFields Include fields (optional).
 *
 * @return this 
 */
MergeApi.prototype.GetQuestionnaireDataSources = function(callbacks, userId, questionnaireId, includeFields) {
	if(userId == null || questionnaireId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/{questionnaireId}/datasources";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "questionnaireId" + "}", utils.toPathValue(questionnaireId));
	// add query parameters
	var queryParams = [];
	if (includeFields != null) {
		queryParams['include_fields'] = utils.toPathValue(includeFields);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Add questionnaire execution
 *
 * @param String userId User GUID (required).
 * @param String collectorId Questionnaire collector id (required).
 * @param QuestionnaireExecutionInfo body Execution (required).
 *
 * @return this 
 */
MergeApi.prototype.AddQuestionnaireExecution = function(callbacks, userId, collectorId, body) {
	if(userId == null || collectorId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/collectors/{collectorId}/executions";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "collectorId" + "}", utils.toPathValue(collectorId));
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
 * Get questionnaire collector executions
 *
 * @param String userId User GUID (required).
 * @param String collectorId Questionnaire collector global unique identifier (required).
 *
 * @return this 
 */
MergeApi.prototype.GetQuestionnaireCollectorExecutions = function(callbacks, userId, collectorId) {
	if(userId == null || collectorId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/collectors/{collectorId}/executions";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "collectorId" + "}", utils.toPathValue(collectorId));
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
 * Get questionnaire executions
 *
 * @param String userId User GUID (required).
 * @param String questionnaireId Questionnaire global unique identifier (required).
 *
 * @return this 
 */
MergeApi.prototype.GetQuestionnaireExecutions = function(callbacks, userId, questionnaireId) {
	if(userId == null || questionnaireId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/{questionnaireId}/executions";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "questionnaireId" + "}", utils.toPathValue(questionnaireId));
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
 * Get questionnaire execution
 *
 * @param String userId User GUID (required).
 * @param String executionId Questionnaire execution global unique identifier (required).
 *
 * @return this 
 */
MergeApi.prototype.GetQuestionnaireExecution = function(callbacks, userId, executionId) {
	if(userId == null || executionId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/executions/{executionId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "executionId" + "}", utils.toPathValue(executionId));
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
 * Removes questionnaire execution
 *
 * @param String userId User GUID (required).
 * @param String executionId Execution id (required).
 *
 * @return this 
 */
MergeApi.prototype.DeleteQuestionnaireExecution = function(callbacks, userId, executionId) {
	if(userId == null || executionId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/executions/{executionId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "executionId" + "}", utils.toPathValue(executionId));
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
 * Update questionnaire execution
 *
 * @param String userId User GUID (required).
 * @param String executionId Execution id (required).
 * @param QuestionnaireExecutionInfo body Execution (required).
 *
 * @return this 
 */
MergeApi.prototype.UpdateQuestionnaireExecution = function(callbacks, userId, executionId, body) {
	if(userId == null || executionId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/executions/{executionId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "executionId" + "}", utils.toPathValue(executionId));
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
 * Update questionnaire execution status
 *
 * @param String userId User GUID (required).
 * @param String executionId Execution id (required).
 * @param String body Status (required).
 *
 * @return this 
 */
MergeApi.prototype.UpdateQuestionnaireExecutionStatus = function(callbacks, userId, executionId, body) {
	if(userId == null || executionId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/merge/{userId}/questionnaires/executions/{executionId}/status";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "executionId" + "}", utils.toPathValue(executionId));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

module.exports = MergeApi;
