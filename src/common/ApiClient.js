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

var utils = require("./utils");
var ApiException = utils.ApiException;
var SecurityHandler = utils.SecurityHandler;
var XMLHttpRequest = (process.browser ? window.XMLHttpRequest : require('xmlhttprequest').XMLHttpRequest);

var ApiClient = function(securityHandler, ajaxOptions) {
	this.securityHandler = (securityHandler || new SecurityHandler());
	this.ajaxOptions = (ajaxOptions || {});
};

ApiClient.prototype.urlify = function(basePath, resourcePath, queryParams) {
	var url = basePath + resourcePath;
	if (queryParams && queryParams.length > 0) {
		url = url + "?" + utils.buildQuery(queryParams);
	}

	return this.securityHandler.handleURL(url);
};

ApiClient.prototype.prepareToCallAPI = function(basePath, resourcePath, method, queryParams, body, headerParams, callbacks) {
	// add default callbacks
	if (utils.isFunction(callbacks)) {
		callbacks = {
			onResponse : callbacks,
			onError : function(response) {
				utils.log(response);
			}
		};
	}
	callbacks.onResponse(this.urlify(basePath, resourcePath, queryParams));
};

ApiClient.prototype.callAPI = function(basePath, resourcePath, method, queryParams, body, headerParams, callbacks) {
	// add default callbacks
	if (utils.isFunction(callbacks)) {
		callbacks = {
			onResponse : callbacks,
			onError : function(response) {
				utils.log(response);
			}
		};
	}

	var data = null;
	if (body === null) {
		headerParams['Content-type'] = "text/html";
	} else if (utils.isObject(body) || utils.isArray(body)) {
		headerParams['Content-type'] = "application/json";
		data = this.securityHandler.handleBody(JSON.stringify(body));
	} else if ( body instanceof File) {
		headerParams['Content-type'] = 'application/octet-stream';
		data = this.securityHandler.handleBody(body);
	}
	utils.log(data);

	var options = {
		url : this.urlify(basePath, resourcePath, queryParams),
		type : method,
		headers : headerParams,
		data : data
	};

	var self = this;
	// use jQuery in browser if it exists
	if (process.browser && window.jQuery && this.ajaxOptions.useJqueryForAjax) {
		utils.log("GroupDocs API access using jQuery " + jQuery.fn.jquery);
		return jQuery.ajax(jQuery.extend({
			processData : false,
			success : function(response, status, jqXHR) {
				var respData;
				try {
					respData = JSON.parse(response);
				} catch(ex) {
					respData = response;
				}
				
				if(self.ajaxOptions.onload){
					self.ajaxOptions.onload.call(callbacks, respData, jqXHR);
				} else {
					callbacks.onResponse(respData, jqXHR);
				}
			},
			error : function(response, status, jqXHR) {
				var respData;
				try {
					respData = JSON.parse(response);
				} catch(ex) {
					respData = response;
				}
				
				if(self.ajaxOptions.onerror){
					self.ajaxOptions.onerror.call(callbacks, respData, jqXHR);
				} else {
					callbacks.onError(respData, jqXHR);
				}
			}
		}, this.ajaxOptions, options));
	} else {
		var opts = utils.mergeOptions(this.ajaxOptions, options);
		var xhr = opts.xhr ? new opts.xhr() : new XMLHttpRequest();
		xhr.open(opts.type, opts.url, (opts.async || true));
		xhr.responseType = opts.responseType || "text";
		xhr.onload = function(event){
			var response = xhr.response || xhr.responseText;

			if(self.ajaxOptions.onload){
				self.ajaxOptions.onload.call(callbacks, response, xhr);
			} else {
				try {
					callbacks.onResponse(JSON.parse(response), xhr);
				} catch(ex) {
					callbacks.onResponse(response, xhr);
				}
			}
		};
		xhr.onerror = opts.onerror || function(event){
			var response = xhr.response || xhr.responseText;
			
			if(self.ajaxOptions.onerror){
				self.ajaxOptions.onerror.call(callbacks, response, xhr);
			} else {
				try {
					callbacks.onError(JSON.parse(response), xhr);
				} catch(ex) {
					callbacks.onError(response, xhr);
				}
			}
		};
		// xhr.upload.onprogress = function(e) {};
		var key;
		for (key in opts.headers) {
			xhr.setRequestHeader(key, opts.headers[key]);
		}
		xhr.send(opts.data);
		return xhr;
	}
};

module.exports = ApiClient;
