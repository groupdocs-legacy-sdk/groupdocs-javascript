(function(){var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var cached = require.cache[resolved];
    var res = cached? cached.exports : mod();
    return res;
};

require.paths = [];
require.modules = {};
require.cache = {};
require.extensions = [".js",".coffee",".json"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            x = path.normalize(x);
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = path.normalize(x + '/package.json');
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key);
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

(function () {
    var process = {};
    var global = typeof window !== 'undefined' ? window : {};
    var definedProcess = false;
    
    require.define = function (filename, fn) {
        if (!definedProcess && require.modules.__browserify_process) {
            process = require.modules.__browserify_process();
            definedProcess = true;
        }
        
        var dirname = require._core[filename]
            ? ''
            : require.modules.path().dirname(filename)
        ;
        
        var require_ = function (file) {
            var requiredModule = require(file, dirname);
            var cached = require.cache[require.resolve(file, dirname)];

            if (cached && cached.parent === null) {
                cached.parent = module_;
            }

            return requiredModule;
        };
        require_.resolve = function (name) {
            return require.resolve(name, dirname);
        };
        require_.modules = require.modules;
        require_.define = require.define;
        require_.cache = require.cache;
        var module_ = {
            id : filename,
            filename: filename,
            exports : {},
            loaded : false,
            parent: null
        };
        
        require.modules[filename] = function () {
            require.cache[filename] = module_;
            fn.call(
                module_.exports,
                require_,
                module_,
                module_.exports,
                dirname,
                filename,
                process,
                global
            );
            module_.loaded = true;
            return module_.exports;
        };
    };
})();


require.define("path",function(require,module,exports,__dirname,__filename,process,global){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

});

require.define("__browserify_process",function(require,module,exports,__dirname,__filename,process,global){var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
        && window.setImmediate;
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    if (name === 'evals') return (require)('vm')
    else throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    process.cwd = function () { return cwd };
    process.chdir = function (dir) {
        if (!path) path = require('path');
        cwd = path.resolve(dir, cwd);
    };
})();

});

require.define("/common/utils.js",function(require,module,exports,__dirname,__filename,process,global){var ApiException = function(message, code) {
	this.name = "ApiException";
	this.message = (message || "");
	this.code = (code || 400);
};

ApiException.prototype = new Error();

ApiException.prototype.toString = function() {
	return '[' + this.name + ': ' + this.code + '] ' + this.message;
};

var SecurityHandler = function() {
};

SecurityHandler.prototype.handleURL = function(url, headers) {
	return url;
};

SecurityHandler.prototype.handleBody = function(body, headers) {
	return body;
};

var toPathValue = function(value) {
	if (isArray(value))
		return value.join(",");
	else
		return value == null ? "" : value.toString();
};

var buildQuery = function(arr) {
	var key, val, tmp_arr = [], i = 0;
	for (key in arr) {
		val = arr[key];
		tmp_arr[i] = key + '=' + val;
		i++;
	}
	return tmp_arr.join("&");
};

var splitUrl = (function() {
	// var regex = new RegExp("(\\w+)://([^/]+)([^\?]*)([\?].+)?");
	var regex = new RegExp("^(\\w+):\/{2}([^\\/:]+)(?:\\:(\\d+))?(\\/(?:[^?]+\\/)?)?([^\\?#]+)?(?:\\?([^#]*))?(\\#.*)?$");
	return function(url) {
		var matches = url.match(regex);
		var host = (matches[2] || "");
		var port = (matches[3] || "");
		var path = (matches[4] || "");
		var name = (matches[5] || "");
		var query = (matches[6] || "");
		var file = path + name + ( query ? ("?" + query) : "");
		var authority = host + ( port ? (":" + port) : "");
		return {
			"schema" : matches[1],
			"host" : host,
			"port" : port,
			"path" : path,
			"name" : name,
			"query" : query,
			"file" : file,
			"authority" : authority
		};
	};
})();

var isObject = function(value) {
	return (Object.prototype.toString.call(value) === '[object Object]');
};

var isArray = function(value) {
	return (Object.prototype.toString.call(value) === '[object Array]');
};

var isFunction = function(value) {
	return (Object.prototype.toString.call(value) === '[object Function]');
};

var mergeOptions = function(obj1, obj2) {
	var obj3 = {};
	for (var attrname in obj1) {
		obj3[attrname] = obj1[attrname];
	}
	for (var attrname in obj2) {
		obj3[attrname] = obj2[attrname];
	}
	return obj3;
}; 

var log = function(msg){
	if(exports.DEBUG){
		console.log(msg);
	}
};

exports.DEBUG = false;
exports.log = log;
exports.mergeOptions = mergeOptions;
exports.toPathValue = toPathValue;
exports.buildQuery = buildQuery;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.splitUrl = splitUrl;
exports.SecurityHandler = SecurityHandler;
exports.ApiException = ApiException;
});

require.define("/common/GroupDocsSecurityHandler.js",function(require,module,exports,__dirname,__filename,process,global){var utils = require("./utils");
var jsSHA = require("./jsSHA");

var GroupDocsSecurityHandler = function(privateKey) {
	this.privateKey = privateKey;
};

GroupDocsSecurityHandler.prototype = new utils.SecurityHandler();

GroupDocsSecurityHandler.prototype.handleURL = function(url, headers) {
	var urlParts = utils.splitUrl(url);
	var pathAndQuery = encodeURI(urlParts.file);
	var shaObj = new jsSHA(pathAndQuery, "TEXT");
	//TODO replace jsSHA with crypto-browserify
	var hmac = shaObj.getHMAC(this.privateKey, "TEXT", "SHA-1", "B64", {
		"b64Pad" : ""
	});
	return url + (urlParts.query ? '&' : '?') + "signature=" + encodeURIComponent(hmac);
};

module.exports = GroupDocsSecurityHandler;

});

require.define("/common/jsSHA.js",function(require,module,exports,__dirname,__filename,process,global){(function() {/*
 A JavaScript implementation of the SHA family of hashes, as defined in FIPS
 PUB 180-2 as well as the corresponding HMAC implementation as defined in
 FIPS PUB 198a

 Copyright Brian Turek 2008-2012
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnson
*/
function k(a){throw a;}function s(a,e){var b=[],f=(1<<e)-1,c=a.length*e,d;for(d=0;d<c;d+=e)b[d>>>5]|=(a.charCodeAt(d/e)&f)<<32-e-d%32;return{value:b,binLen:c}}function u(a){var e=[],b=a.length,f,c;0!==b%2&&k("String of HEX type must be in byte increments");for(f=0;f<b;f+=2)c=parseInt(a.substr(f,2),16),isNaN(c)&&k("String of HEX type contains invalid characters"),e[f>>>3]|=c<<24-4*(f%8);return{value:e,binLen:4*b}}
function v(a){var e=[],b=0,f,c,d,g,h;-1===a.search(/^[a-zA-Z0-9=+\/]+$/)&&k("Invalid character in base-64 string");f=a.indexOf("=");a=a.replace(/\=/g,"");-1!==f&&f<a.length&&k("Invalid '=' found in base-64 string");for(c=0;c<a.length;c+=4){h=a.substr(c,4);for(d=g=0;d<h.length;d+=1)f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(h[d]),g|=f<<18-6*d;for(d=0;d<h.length-1;d+=1)e[b>>2]|=(g>>>16-8*d&255)<<24-8*(b%4),b+=1}return{value:e,binLen:8*b}}
function w(a,e){var b="",f=4*a.length,c,d;for(c=0;c<f;c+=1)d=a[c>>>2]>>>8*(3-c%4),b+="0123456789abcdef".charAt(d>>>4&15)+"0123456789abcdef".charAt(d&15);return e.outputUpper?b.toUpperCase():b}
function x(a,e){var b="",f=4*a.length,c,d,g;for(c=0;c<f;c+=3){g=(a[c>>>2]>>>8*(3-c%4)&255)<<16|(a[c+1>>>2]>>>8*(3-(c+1)%4)&255)<<8|a[c+2>>>2]>>>8*(3-(c+2)%4)&255;for(d=0;4>d;d+=1)b=8*c+6*d<=32*a.length?b+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(g>>>6*(3-d)&63):b+e.b64Pad}return b}
function y(a){var e={outputUpper:!1,b64Pad:"="};try{a.hasOwnProperty("outputUpper")&&(e.outputUpper=a.outputUpper),a.hasOwnProperty("b64Pad")&&(e.b64Pad=a.b64Pad)}catch(b){}"boolean"!==typeof e.outputUpper&&k("Invalid outputUpper formatting option");"string"!==typeof e.b64Pad&&k("Invalid b64Pad formatting option");return e}function z(a,e){var b=(a&65535)+(e&65535);return((a>>>16)+(e>>>16)+(b>>>16)&65535)<<16|b&65535}
function A(a,e,b,f,c){var d=(a&65535)+(e&65535)+(b&65535)+(f&65535)+(c&65535);return((a>>>16)+(e>>>16)+(b>>>16)+(f>>>16)+(c>>>16)+(d>>>16)&65535)<<16|d&65535}
function B(a,e){var b=[],f,c,d,g,h,C,t,j,D,l=[1732584193,4023233417,2562383102,271733878,3285377520],n=[1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,
1859775393,1859775393,1859775393,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782];a[e>>>5]|=128<<24-e%32;a[(e+
65>>>9<<4)+15]=e;D=a.length;for(t=0;t<D;t+=16){f=l[0];c=l[1];d=l[2];g=l[3];h=l[4];for(j=0;80>j;j+=1)b[j]=16>j?a[j+t]:(b[j-3]^b[j-8]^b[j-14]^b[j-16])<<1|(b[j-3]^b[j-8]^b[j-14]^b[j-16])>>>31,C=20>j?A(f<<5|f>>>27,c&d^~c&g,h,n[j],b[j]):40>j?A(f<<5|f>>>27,c^d^g,h,n[j],b[j]):60>j?A(f<<5|f>>>27,c&d^c&g^d&g,h,n[j],b[j]):A(f<<5|f>>>27,c^d^g,h,n[j],b[j]),h=g,g=d,d=c<<30|c>>>2,c=f,f=C;l[0]=z(f,l[0]);l[1]=z(c,l[1]);l[2]=z(d,l[2]);l[3]=z(g,l[3]);l[4]=z(h,l[4])}return l}
module.exports=function(a,e,b){var f=null,c=0,d=[0],g=0,h=null,g="undefined"!==typeof b?b:8;8===g||16===g||k("charSize must be 8 or 16");"HEX"===e?(0!==a.length%2&&k("srcString of HEX type must be in byte increments"),h=u(a),c=h.binLen,d=h.value):"ASCII"===e||"TEXT"===e?(h=s(a,g),c=h.binLen,d=h.value):"B64"===e?(h=v(a),c=h.binLen,d=h.value):k("inputFormat must be HEX, TEXT, ASCII, or B64");this.getHash=function(b,a,e){var g=null,h=d.slice(),n="";switch(a){case "HEX":g=w;break;case "B64":g=x;break;default:k("format must be HEX or B64")}"SHA-1"===
b?(null===f&&(f=B(h,c)),n=g(f,y(e))):k("Chosen SHA variant is not supported");return n};this.getHMAC=function(b,a,e,f,h){var n,p,m,E,r,F,G=[],H=[],q=null;switch(f){case "HEX":n=w;break;case "B64":n=x;break;default:k("outputFormat must be HEX or B64")}"SHA-1"===e?(m=64,F=160):k("Chosen SHA variant is not supported");"HEX"===a?(q=u(b),r=q.binLen,p=q.value):"ASCII"===a||"TEXT"===a?(q=s(b,g),r=q.binLen,p=q.value):"B64"===a?(q=v(b),r=q.binLen,p=q.value):k("inputFormat must be HEX, TEXT, ASCII, or B64");
b=8*m;a=m/4-1;m<r/8?("SHA-1"===e?p=B(p,r):k("Unexpected error in HMAC implementation"),p[a]&=4294967040):m>r/8&&(p[a]&=4294967040);for(m=0;m<=a;m+=1)G[m]=p[m]^909522486,H[m]=p[m]^1549556828;"SHA-1"===e?E=B(H.concat(B(G.concat(d),b+c)),b+F):k("Unexpected error in HMAC implementation");return n(E,y(h))}};})();
});

require.define("/common/ApiClient.js",function(require,module,exports,__dirname,__filename,process,global){/**
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
		headerParams['Content-type'] = body.type;
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

});

require.define("/apis/AntApi.js",function(require,module,exports,__dirname,__filename,process,global){/**
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

module.exports = AntApi;

});

require.define("/apis/AsyncApi.js",function(require,module,exports,__dirname,__filename,process,global){/**
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

});

require.define("/apis/ComparisonApi.js",function(require,module,exports,__dirname,__filename,process,global){/**
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
 * @this ComparisonApi
 * @param {ApiClient} apiClient The ApiClient instance (required)
 * @param {string} basePath The base path of API server (optional)
 */
var ComparisonApi = function(apiClient, basePath) {
	this.apiClient = apiClient;
	this.basePath = (basePath || "https://api.groupdocs.com/v2.0");
};

/**
 * Download comparison result file
 *
 * @param String userId User GUID (required).
 * @param String resultFileId Comparison result file GUID (required).
 * @param String format Comparison result file format (optional).
 *
 * @return this 
 */
ComparisonApi.prototype.DownloadResult = function(callbacks, userId, resultFileId, format) {
	if(userId == null || resultFileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/comparison/{userId}/comparison/download";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (resultFileId != null) {
		queryParams['resultFileId'] = utils.toPathValue(resultFileId);
	}
	if (format != null) {
		queryParams['format'] = utils.toPathValue(format);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.prepareToCallAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Compare
 *
 * @param String userId User GUID (required).
 * @param String sourceFileId Source File GUID (required).
 * @param String targetFileId Target File GUID (required).
 * @param String callbackUrl Callback Url (required).
 *
 * @return this 
 */
ComparisonApi.prototype.Compare = function(callbacks, userId, sourceFileId, targetFileId, callbackUrl) {
	if(userId == null || sourceFileId == null || targetFileId == null || callbackUrl == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/comparison/{userId}/comparison/compare";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (sourceFileId != null) {
		queryParams['source'] = utils.toPathValue(sourceFileId);
	}
	if (targetFileId != null) {
		queryParams['target'] = utils.toPathValue(targetFileId);
	}
	if (callbackUrl != null) {
		queryParams['callback'] = utils.toPathValue(callbackUrl);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get changes
 *
 * @param String userId User GUID (required).
 * @param String resultFileId Comparison result file GUID (required).
 *
 * @return this 
 */
ComparisonApi.prototype.GetChanges = function(callbacks, userId, resultFileId) {
	if(userId == null || resultFileId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/comparison/{userId}/comparison/changes";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (resultFileId != null) {
		queryParams['resultFileId'] = utils.toPathValue(resultFileId);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Update changes
 *
 * @param String userId User GUID (required).
 * @param String resultFileId Comparison result file GUID (required).
 * @param List[ChangeInfo] body Comparison changes to update (accept or reject) (required).
 *
 * @return this 
 */
ComparisonApi.prototype.UpdateChanges = function(callbacks, userId, resultFileId, body) {
	if(userId == null || resultFileId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/comparison/{userId}/comparison/changes";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (resultFileId != null) {
		queryParams['resultFileId'] = utils.toPathValue(resultFileId);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "PUT", queryParams, postData, headerParams, callbacks);
	return this;
}

/**
 * Get document details
 *
 * @param String userId User GUID (required).
 * @param String guid Document GUID (required).
 *
 * @return this 
 */
ComparisonApi.prototype.GetDocumentDetails = function(callbacks, userId, guid) {
	if(userId == null || guid == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/comparison/{userId}/comparison/document";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	// add query parameters
	var queryParams = [];
	if (guid != null) {
		queryParams['guid'] = utils.toPathValue(guid);
	}
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

module.exports = ComparisonApi;

});

require.define("/apis/DocApi.js",function(require,module,exports,__dirname,__filename,process,global){/**
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

module.exports = DocApi;

});

require.define("/apis/MergeApi.js",function(require,module,exports,__dirname,__filename,process,global){/**
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
 * Add job document datasource
 *
 * @param String userId User GUID (required).
 * @param String jobId Job indetifier (required).
 * @param String fileId File indetifier (required).
 * @param String datasourceId Datasource indetifier (required).
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

module.exports = MergeApi;

});

require.define("/apis/MgmtApi.js",function(require,module,exports,__dirname,__filename,process,global){/**
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

});

require.define("/apis/PostApi.js",function(require,module,exports,__dirname,__filename,process,global){/**
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

});

require.define("/apis/SharedApi.js",function(require,module,exports,__dirname,__filename,process,global){/**
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
 * @param String fileName File name (required).
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

});

require.define("/apis/SignatureApi.js",function(require,module,exports,__dirname,__filename,process,global){/**
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
 * @param Number envelopeGuid A envelopeGuid of the envelope which will be used to created the new envelope (optional).
 * @param String templateGuid A templateGuid of the template which will be used to created the new envelope (optional).
 *
 * @return this 
 */
SignatureApi.prototype.CreateSignatureEnvelope = function(callbacks, userId, name, body, envelopeGuid, templateGuid) {
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
	if (envelopeGuid != null) {
		queryParams['envelopeGuid'] = utils.toPathValue(envelopeGuid);
	}
	if (templateGuid != null) {
		queryParams['templateGuid'] = utils.toPathValue(templateGuid);
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
 *
 * @return this 
 */
SignatureApi.prototype.SignatureEnvelopeSend = function(callbacks, userId, envelopeId) {
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

module.exports = SignatureApi;

});

require.define("/apis/StorageApi.js",function(require,module,exports,__dirname,__filename,process,global){/**
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

});

require.define("/apis/SystemApi.js",function(require,module,exports,__dirname,__filename,process,global){/**
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
 * @this SystemApi
 * @param {ApiClient} apiClient The ApiClient instance (required)
 * @param {string} basePath The base path of API server (optional)
 */
var SystemApi = function(apiClient, basePath) {
	this.apiClient = apiClient;
	this.basePath = (basePath || "https://api.groupdocs.com/v2.0");
};

/**
 * Get user plan
 *
 * @param String callerId User GUID (required).
 *
 * @return this 
 */
SystemApi.prototype.GetUserPlan = function(callbacks, callerId) {
	if(callerId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/system/{callerId}/plan";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
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
 * Get user plan
 *
 * @param String callerId User GUID (required).
 *
 * @return this 
 */
SystemApi.prototype.GetUserSubscriptionPlan = function(callbacks, callerId) {
	if(callerId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/system/{callerId}/subscription";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
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
 * Get subscription plans
 *
 * @param String callerId User GUID (required).
 * @param String family Product Family Name (required).
 *
 * @return this 
 */
SystemApi.prototype.GetSubscriptionPlans = function(callbacks, callerId, family) {
	if(callerId == null || family == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/system/{callerId}/plans/{family}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
	resourcePath = resourcePath.replace("{" + "family" + "}", utils.toPathValue(family));
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
 * Set subscription plan user plan
 *
 * @param String userId User GUID (required).
 * @param String productId Product ID (required).
 * @param SubscriptionPlanInfo body Subscription Plan (required).
 *
 * @return this 
 */
SystemApi.prototype.SetSubscriptionPlan = function(callbacks, userId, productId, body) {
	if(userId == null || productId == null || body == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/system/{userId}/subscriptions/{productId}";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "userId" + "}", utils.toPathValue(userId));
	resourcePath = resourcePath.replace("{" + "productId" + "}", utils.toPathValue(productId));
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
 * Get countries
 *
 * @param String callerId User GUID (required).
 *
 * @return this 
 */
SystemApi.prototype.GetCountries = function(callbacks, callerId) {
	if(callerId == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/system/{callerId}/countries";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
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
 * Get states
 *
 * @param String callerId User GUID (required).
 * @param String countryName Country Name (required).
 *
 * @return this 
 */
SystemApi.prototype.GetStates = function(callbacks, callerId, countryName) {
	if(callerId == null || countryName == null ) {
		throw new utils.ApiException("missing required parameters", 400);
	}
	var resourcePath = "/system/{callerId}/countries/{countryName}/states";

	// replace path parameters
	resourcePath = resourcePath.replace("{" + "callerId" + "}", utils.toPathValue(callerId));
	resourcePath = resourcePath.replace("{" + "countryName" + "}", utils.toPathValue(countryName));
	// add query parameters
	var queryParams = [];
	// add header parameters
	var headerParams = [];
	// make the API Call
	var postData = ( typeof (body) === "undefined" ? null : body);
	this.apiClient.callAPI(this.basePath, resourcePath, "GET", queryParams, postData, headerParams, callbacks);
	return this;
}

module.exports = SystemApi;

});

require.define("/index.js",function(require,module,exports,__dirname,__filename,process,global){var classes = {};
classes.utils = require('./common/utils');
classes.ApiException = classes.utils.ApiException;
classes.GroupDocsSecurityHandler = require('./common/GroupDocsSecurityHandler');

classes.ApiClient = require('./common/ApiClient');
classes.AntApi = require('./apis/AntApi');
classes.AsyncApi = require('./apis/AsyncApi');
classes.ComparisonApi = require('./apis/ComparisonApi');
classes.DocApi = require('./apis/DocApi');
classes.MergeApi = require('./apis/MergeApi');
classes.MgmtApi = require('./apis/MgmtApi');
classes.PostApi = require('./apis/PostApi');
classes.SharedApi = require('./apis/SharedApi');
classes.SignatureApi = require('./apis/SignatureApi');
classes.StorageApi = require('./apis/StorageApi');
classes.SystemApi = require('./apis/SystemApi');

module.exports = classes;

if (process.browser){
	global.groupdocs = classes;
}

// exports.ApiException = require('./common/ApiException');
// exports.StorageApi = require('./apis/StorageApi');

// exports['groupdocs-javascript'] = classes;
});
require("/index.js");
})();
