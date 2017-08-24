/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "8da3f53d16abcf7b0446"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(37)(__webpack_require__.s = 37);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(28)('wks');
var uid = __webpack_require__(29);
var Symbol = __webpack_require__(0).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(78);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(9);
var createDesc = __webpack_require__(26);
module.exports = __webpack_require__(7) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(25)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var core = __webpack_require__(4);
var ctx = __webpack_require__(11);
var hide = __webpack_require__(5);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(6);
var IE8_DOM_DEFINE = __webpack_require__(44);
var toPrimitive = __webpack_require__(45);
var dP = Object.defineProperty;

exports.f = __webpack_require__(7) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(12);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);
var document = __webpack_require__(0).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(52);
var defined = __webpack_require__(17);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(28)('keys');
var uid = __webpack_require__(29);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(9).f;
var has = __webpack_require__(14);
var TAG = __webpack_require__(1)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(12);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(24);
var $export = __webpack_require__(8);
var redefine = __webpack_require__(46);
var hide = __webpack_require__(5);
var has = __webpack_require__(14);
var Iterators = __webpack_require__(10);
var $iterCreate = __webpack_require__(47);
var setToStringTag = __webpack_require__(21);
var getPrototypeOf = __webpack_require__(55);
var ITERATOR = __webpack_require__(1)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(16);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(0).document;
module.exports = document && document.documentElement;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(15);
var TAG = __webpack_require__(1)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(6);
var aFunction = __webpack_require__(12);
var SPECIES = __webpack_require__(1)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(11);
var invoke = __webpack_require__(67);
var html = __webpack_require__(31);
var cel = __webpack_require__(18);
var global = __webpack_require__(0);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(15)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var newPromiseCapability = __webpack_require__(22);

module.exports = function (C, x) {
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(38);


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__assets_fonts_NZK_font_css__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__assets_fonts_NZK_font_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__assets_fonts_NZK_font_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fontfaceobserver__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fontfaceobserver___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_fontfaceobserver__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__styles_main_sass__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__styles_main_sass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__styles_main_sass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__js_Game__ = __webpack_require__(77);







var texture = PIXI.Texture.fromImage('https://res.cloudinary.com/nzk/image/upload/f_auto,w_1250/v1474041383/uta2qdw7uxmuoc8upf0r.jpg');
var sprite = new PIXI.Sprite(texture);

// Set FontObservers
var NZKFontObserver = new __WEBPACK_IMPORTED_MODULE_2_fontfaceobserver___default.a('NZK');
var LibreFontObserver = new __WEBPACK_IMPORTED_MODULE_2_fontfaceobserver___default.a('Libre Baskerville');
__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a.all([NZKFontObserver.load(), LibreFontObserver.load()]).then(function () {
  new __WEBPACK_IMPORTED_MODULE_4__js_Game__["a" /* default */]();
}, function () {
  console.log('Font is not available');
});

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(40), __esModule: true };

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(41);
__webpack_require__(42);
__webpack_require__(57);
__webpack_require__(61);
__webpack_require__(72);
__webpack_require__(73);
module.exports = __webpack_require__(4).Promise;


/***/ }),
/* 41 */
/***/ (function(module, exports) {



/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(43)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(23)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(16);
var defined = __webpack_require__(17);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(7) && !__webpack_require__(25)(function () {
  return Object.defineProperty(__webpack_require__(18)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(13);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(48);
var descriptor = __webpack_require__(26);
var setToStringTag = __webpack_require__(21);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(5)(IteratorPrototype, __webpack_require__(1)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(6);
var dPs = __webpack_require__(49);
var enumBugKeys = __webpack_require__(30);
var IE_PROTO = __webpack_require__(20)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(18)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(31).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(9);
var anObject = __webpack_require__(6);
var getKeys = __webpack_require__(50);

module.exports = __webpack_require__(7) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(51);
var enumBugKeys = __webpack_require__(30);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(14);
var toIObject = __webpack_require__(19);
var arrayIndexOf = __webpack_require__(53)(false);
var IE_PROTO = __webpack_require__(20)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(15);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(19);
var toLength = __webpack_require__(27);
var toAbsoluteIndex = __webpack_require__(54);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(16);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(14);
var toObject = __webpack_require__(56);
var IE_PROTO = __webpack_require__(20)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(17);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(58);
var global = __webpack_require__(0);
var hide = __webpack_require__(5);
var Iterators = __webpack_require__(10);
var TO_STRING_TAG = __webpack_require__(1)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(59);
var step = __webpack_require__(60);
var Iterators = __webpack_require__(10);
var toIObject = __webpack_require__(19);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(23)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(24);
var global = __webpack_require__(0);
var ctx = __webpack_require__(11);
var classof = __webpack_require__(32);
var $export = __webpack_require__(8);
var isObject = __webpack_require__(13);
var aFunction = __webpack_require__(12);
var anInstance = __webpack_require__(62);
var forOf = __webpack_require__(63);
var speciesConstructor = __webpack_require__(33);
var task = __webpack_require__(34).set;
var microtask = __webpack_require__(68)();
var newPromiseCapabilityModule = __webpack_require__(22);
var perform = __webpack_require__(35);
var promiseResolve = __webpack_require__(36);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(1)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var sameConstructor = LIBRARY ? function (a, b) {
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
} : function (a, b) {
  return a === b;
};
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c;
  var i = 0;
  var reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  } return true;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(69)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return sameConstructor($Promise, C)
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(21)($Promise, PROMISE);
__webpack_require__(70)(PROMISE);
Wrapper = __webpack_require__(4)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if (x instanceof $Promise && sameConstructor(x.constructor, this)) return x;
    return promiseResolve(this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(71)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(11);
var call = __webpack_require__(64);
var isArrayIter = __webpack_require__(65);
var anObject = __webpack_require__(6);
var toLength = __webpack_require__(27);
var getIterFn = __webpack_require__(66);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(6);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(10);
var ITERATOR = __webpack_require__(1)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(32);
var ITERATOR = __webpack_require__(1)('iterator');
var Iterators = __webpack_require__(10);
module.exports = __webpack_require__(4).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 67 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var macrotask = __webpack_require__(34).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(15)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(5);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(0);
var core = __webpack_require__(4);
var dP = __webpack_require__(9);
var DESCRIPTORS = __webpack_require__(7);
var SPECIES = __webpack_require__(1)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(1)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(8);
var core = __webpack_require__(4);
var global = __webpack_require__(0);
var speciesConstructor = __webpack_require__(33);
var promiseResolve = __webpack_require__(36);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(8);
var newPromiseCapability = __webpack_require__(22);
var perform = __webpack_require__(35);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),
/* 74 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {


/* Font Face Observer v2.0.13 - © Bram Stein. License: BSD-3-Clause */
    (function () {
      function l (a, b) {
        document.addEventListener ? a.addEventListener("scroll", b, !1) : a.attachEvent("scroll", b)
      }
      function m (a) {
        document.body ? a() : document.addEventListener ? document.addEventListener("DOMContentLoaded", function c () {
          document.removeEventListener("DOMContentLoaded", c)
          a()
        }) : document.attachEvent("onreadystatechange", function k () {
          if ("interactive" == document.readyState || "complete" == document.readyState) document.detachEvent("onreadystatechange", k), a()
        })
      }
      function r (a) {
        this.a = document.createElement("div")
        this.a.setAttribute("aria-hidden", "true")
        this.a.appendChild(document.createTextNode(a))
        this.b = document.createElement("span")
        this.c = document.createElement("span")
        this.h = document.createElement("span")
        this.f = document.createElement("span")
        this.g = -1
        this.b.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;"
        this.c.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;"
        this.f.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.h.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.b.appendChild(this.h);this.c.appendChild(this.f);this.a.appendChild(this.b);this.a.appendChild(this.c)}
      function t (a, b) {
        a.a.style.cssText = "max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:" + b + ";"
      }
      function y (a) {
        var b = a.a.offsetWidth, c = b + 100
        a.f.style.width = c + "px"
        a.c.scrollLeft = c
        a.b.scrollLeft = a.b.scrollWidth + 100
        return a.g !== b ? (a.g = b, !0) : !1
      }
      function z (a, b) {
        function c () {
          var a = k
          y(a) && a.a.parentNode && b(a.g)
        }
        var k = a
        l(a.b, c)
        l(a.c, c)
        y(a)
      }
      function A (a, b) {
        var c = b || {}
        this.family = a
        this.style = c.style || "normal"
        this.weight = c.weight || "normal"
        this.stretch = c.stretch || "normal"
      }
      var B = null, C = null, E = null, F = null
      function G () {
        if (null === C) if (J() && /Apple/.test(window.navigator.vendor)) {
          var a = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent)
          C = !!a && 603 > parseInt(a[1], 10)
        } else C = !1
        return C
      }
      function J () {
        null === F && (F = !!document.fonts)
        return F
      }
      function K(){if(null===E){var a=document.createElement("div");try{a.style.font="condensed 100px sans-serif"}catch(b){}E=""!==a.style.font}return E}function L(a,b){return[a.style,a.weight,K()?a.stretch:"","100px",b].join(" ")}
A.prototype.load=function(a,b){var c=this,k=a||"BESbswy",q=0,D=b||3E3,H=(new Date).getTime();return new Promise(function(a,b){if(J()&&!G()){var M=new Promise(function(a,b){function e(){(new Date).getTime()-H>=D?b():document.fonts.load(L(c,'"'+c.family+'"'),k).then(function(c){1<=c.length?a():setTimeout(e,25)},function(){b()})}e()}),N=new Promise(function(a,c){q=setTimeout(c,D)});Promise.race([N,M]).then(function(){clearTimeout(q);a(c)},function(){b(c)})}else m(function(){function u(){var b;if(b=-1!=
f&&-1!=g||-1!=f&&-1!=h||-1!=g&&-1!=h)(b=f!=g&&f!=h&&g!=h)||(null===B&&(b=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),B=!!b&&(536>parseInt(b[1],10)||536===parseInt(b[1],10)&&11>=parseInt(b[2],10))),b=B&&(f==v&&g==v&&h==v||f==w&&g==w&&h==w||f==x&&g==x&&h==x)),b=!b;b&&(d.parentNode&&d.parentNode.removeChild(d),clearTimeout(q),a(c))}function I(){if((new Date).getTime()-H>=D)d.parentNode&&d.parentNode.removeChild(d),b(c);else{var a=document.hidden;if(!0===a||void 0===a)f=e.a.offsetWidth,
g=n.a.offsetWidth,h=p.a.offsetWidth,u();q=setTimeout(I,50)}}var e=new r(k),n=new r(k),p=new r(k),f=-1,g=-1,h=-1,v=-1,w=-1,x=-1,d=document.createElement("div");d.dir="ltr";t(e,L(c,"sans-serif"));t(n,L(c,"serif"));t(p,L(c,"monospace"));d.appendChild(e.a);d.appendChild(n.a);d.appendChild(p.a);document.body.appendChild(d);v=e.a.offsetWidth;w=n.a.offsetWidth;x=p.a.offsetWidth;I();z(e,function(a){f=a;u()});t(e,L(c,'"'+c.family+'",sans-serif'));z(n,function(a){g=a;u()});t(n,L(c,'"'+c.family+'",serif'));
z(p,function(a){h=a;u()});t(p,L(c,'"'+c.family+'",monospace'))})})}; true?module.exports=A:(window.FontFaceObserver=A,window.FontFaceObserver.prototype.load=A.prototype.load);}());


/***/ }),
/* 76 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Tile__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Letter__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__VoidMonster__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__SpellingGameHud__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__WhackAMoleHud__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__IckMonster__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__StifleMonster__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__assets_data_data_json__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__assets_data_data_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__assets_data_data_json__);










// import PIXI from 'pixi.js'

var hudStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 30,
  fill: '#D5286E'
});

var end_scoreStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 80,
  fill: '#51197E'
});
var end_scoreLabelStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 30,
  fill: '#7E0E7C'
});
var end_rewardLabelStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 30,
  fill: '#8C004B'
});
var end_rewardStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 40,
  fill: '#DE0077'
});

var Game = function () {
  function Game() {
    var _this = this;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Game);

    this.availableHints = 3;
    this.usedHints = 0;
    this.level = 0;
    this.score = 0;
    this.renderer = PIXI.autoDetectRenderer(256, 256, { antialias: false, transparent: false, resolution: 1 });

    document.body.appendChild(this.renderer.view);
    this.renderer.backgroundColor = 0xfffff;

    this.renderer.view.style.position = 'absolute';
    this.renderer.view.style.display = 'block';
    this.renderer.autoResize = true;
    this.renderer.resize(window.innerHeight * 4 / 3, window.innerHeight);
    this.renderer.view.style.left = 'calc(50% - ' + window.innerHeight * 4 / 6 + 'px)';
    this.renderer.view.style.top = 'calc(50% - ' + window.innerHeight / 2 + 'px)';
    this.stage = new PIXI.Container();
    this.stage.updateLayersOrder = function () {
      _this.stage.children.sort(function (a, b) {
        a.zIndex = a.zIndex || 0;
        b.zIndex = b.zIndex || 0;
        return a.zIndex - b.zIndex;
      });
    };
    this.originalStageSize = { w: this.renderer.width, h: this.renderer.height };
    this.addBackground(this.stage, '/assets/background.jpg');
    this.addForeground(this.stage, '/assets/enclosures-woods-01.png');

    this.letters = [];
    this.tiles = [];
    this.correctLetters = 0;

    var words = __WEBPACK_IMPORTED_MODULE_9__assets_data_data_json___default.a['year1/2'].slice();
    var pickedWords = [];
    for (var i = 0; i < 3; i++) {
      var index = Math.floor(Math.random() * words.length);
      pickedWords.push(words[index]);
      words.splice(index, 1);
    }

    this.words = pickedWords.map(function (word) {
      return [{ element: word.word, hint: word.hint, usedHint: false }, { element: word.sentence.split('|').join(' '), hint: word.hint, usedHint: false }];
    }).reduce(function (a, b) {
      return a.concat(b);
    });

    //this.words = [{
    //element: '1',
    //hint: 'ZA',
    //usedHint: false
    //}]

    this.currentWordIndex = 0;
    this.word = this.words[this.currentWordIndex];

    this.generateScene(this.word);

    this.renderHud();

    this.animate();

    window.addEventListener('resize', function () {
      // this.renderer.resize(window.innerHeight * 4 / 3, window.innerHeight)
      // this.stage.height = this.originalStageSize.h
      // this.stage.width = this.originalStageSize.w
      // this.stage.position.x = (window.innerWidth - this.originalStageSize.w) / 2
      // this.stage.position.y = (window.innerHeight - this.originalStageSize.h) / 2
    });
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Game, [{
    key: 'animate',
    value: function animate() {
      this.renderer.render(this.stage);
      window.requestAnimationFrame(this.animate.bind(this));
    }
  }, {
    key: 'createRectangle',
    value: function createRectangle(x, y, height, width, color) {
      var rectangle = new PIXI.Graphics();
      rectangle.beginFill(color);
      rectangle.lineStyle(10, color);
      rectangle.moveTo(x, y);
      rectangle.lineTo(x + width, y);
      rectangle.lineTo(x + width, y + height);
      rectangle.lineTo(x, y + height);
      rectangle.endFill();
      return rectangle;
    }
  }, {
    key: 'createBlock',
    value: function createBlock(x, y, height, width) {
      var blockTexture = PIXI.Texture.fromImage('/assets/block.png');
      var block = new PIXI.Sprite(blockTexture);
      block.height = height;
      block.width = width;
      block.position.x = x;
      block.position.y = y;
      return block;
    }
  }, {
    key: 'renderImage',
    value: function renderImage(x, y, width, height, image) {
      var blockTexture = PIXI.Texture.fromImage(image);
      var block = new PIXI.Sprite(blockTexture);
      block.height = height;
      block.width = width;
      block.position.x = x;
      block.position.y = y;
      return block;
    }
  }, {
    key: 'renderHud',
    value: function renderHud() {
      this.spellingHud = new __WEBPACK_IMPORTED_MODULE_5__SpellingGameHud__["a" /* default */](this.renderer.width, this.renderer.height, this.displayHint.bind(this));
      this.spellingHud.container.zIndex = 6;
      this.stage.addChild(this.spellingHud.container);
      this.stage.updateLayersOrder();
    }
  }, {
    key: 'addBackground',
    value: function addBackground(stage, image) {
      var landscapeTexture = PIXI.Texture.fromImage(image);
      var texture2 = new PIXI.Texture(landscapeTexture);
      this.background = new PIXI.Sprite(texture2);
      this.background.height = this.renderer.height;
      this.background.width = this.renderer.width;
      this.background.zIndex = -5;
      this.background.anchor.x = 0;
      this.background.anchor.y = 0;
      this.background.position.x = 0;
      this.background.position.y = 0;
      stage.addChild(this.background);
      stage.updateLayersOrder();
    }
  }, {
    key: 'addForeground',
    value: function addForeground(stage, image) {
      var landscapeTexture = PIXI.Texture.fromImage(image);
      var texture2 = new PIXI.Texture(landscapeTexture);
      this.foreground = new PIXI.Sprite(texture2);
      this.foreground.height = this.renderer.height;
      this.foreground.width = this.renderer.width;
      this.foreground.zIndex = 5;
      this.foreground.anchor.x = 0;
      this.foreground.anchor.y = 0;
      this.foreground.position.x = 0;
      this.foreground.position.y = 0;
      stage.addChild(this.foreground);
      stage.updateLayersOrder();
    }
  }, {
    key: 'cleanScene',
    value: function cleanScene() {
      var _this2 = this;

      this.letters.map(function (letter) {
        _this2.stage.removeChild(letter.letter);
      });

      this.tiles.map(function (tile) {
        _this2.stage.removeChild(tile.graphics);
      });
    }
  }, {
    key: 'renderTileRow',
    value: function renderTileRow() {}
  }, {
    key: 'generateScene',
    value: function generateScene(word) {
      var _this3 = this;

      this.cleanScene();
      this.letters = [];
      this.tiles = [];
      var TILE_LENGTH = 120;

      var elements = word.element.split(' ').length > 1 ? word.element.split(' ') : word.element.split('');

      this.tiles = elements.map(function (l, i) {
        var margin = _this3.renderer.width / 2 - Math.min(elements.length, 6) * (TILE_LENGTH + 20) / 2;
        var originalY = _this3.renderer.height / 3;
        var y = originalY;
        if (i > 5) {
          y = originalY + 200;
        }
        var pos = {
          x: margin + 120 * (i % 6),
          y: y
        };
        return new __WEBPACK_IMPORTED_MODULE_2__Tile__["a" /* default */](_this3, i, margin + (TILE_LENGTH + 20) * (i % 6), pos.y, TILE_LENGTH, l);
      });

      this.letters = elements.map(function (element, i) {
        return new __WEBPACK_IMPORTED_MODULE_3__Letter__["a" /* default */](_this3, element, Math.random() * (_this3.renderer.width - 100) + 50, Math.random() * (_this3.renderer.height / 3) + _this3.renderer.height / 2, i, _this3.tiles);
      });
    }
  }, {
    key: 'nextWord',
    value: function nextWord() {
      this.spellingHud.clearHint();

      if (this.currentWordIndex < this.words.length - 1) {
        this.currentWordIndex++;

        this.spellingHud.setLevel(this.currentWordIndex);
        this.word = this.words[this.currentWordIndex];
        this.generateScene(this.word);
      } else {
        this.generateWhackAMoleScene();
      }
    }
  }, {
    key: 'calculateScore',
    value: function calculateScore() {
      var correct = 0;
      var placed = 0;
      this.letters.map(function (letter) {
        if (letter.correct) {
          correct++;
        }
        if (letter.placedIndex > -1) {
          placed++;
        }
      });

      if (correct === this.letters.length) {
        var earnedPoint = this.word.usedHint ? 5 : 10;

        this.score += earnedPoint;
        this.spellingHud.setScore(this.score);
        this.nextWord();
      } else if (placed === this.letters.length) {
        this.nextWord();
      }
    }
  }, {
    key: 'incrementScore',
    value: function incrementScore(points) {
      this.whackAMoleScore += points;
      this.whackAMoleHud.setScore(this.whackAMoleScore);
    }
  }, {
    key: 'gameOver',
    value: function gameOver() {
      this.gameOver = true;
    }
  }, {
    key: 'startTimer',
    value: function startTimer() {
      var _this4 = this;

      var interval = setInterval(function () {
        var time = parseInt(_this4.whackAMoleHud.getTime()) - 1;
        if (time < 0) {
          /// GAME OVER SCREEN
          for (var i = _this4.stage.children.length - 1; i >= 0; i--) {
            _this4.stage.removeChild(_this4.stage.children[i]);
          }
          _this4.generateEndScene();

          clearInterval(interval);
        } else {
          _this4.whackAMoleHud.setTime(time);
        }
      }, 1000);
    }
  }, {
    key: 'generateEndScene',
    value: function generateEndScene() {

      this.addBackground(this.stage, '/assets/background.jpg');
      this.addForeground(this.stage, '/assets/enclosures-woods-01.png');

      var bgEnd = this.renderImage(this.renderer.width / 2, this.renderer.height / 2, this.renderer.width / 2, this.renderer.width / 2, '/assets/ORB.png');
      bgEnd.anchor.set(0.5);
      this.stage.addChild(bgEnd);

      var scoreLabel = new PIXI.Text('SCORE', end_scoreLabelStyle);
      scoreLabel.style.fontSize = 50;

      scoreLabel.anchor.set(0.5);
      scoreLabel.x = this.renderer.width / 2;
      scoreLabel.y = this.renderer.height / 2 - 100;
      this.stage.addChild(scoreLabel);

      var whackScoreLabel = new PIXI.Text(this.whackAMoleScore, end_scoreStyle);
      whackScoreLabel.anchor.set(0.5);
      whackScoreLabel.x = this.renderer.width / 2;
      whackScoreLabel.y = this.renderer.height / 2 - 30;
      this.stage.addChild(whackScoreLabel);

      var rewardLabel = new PIXI.Text('REWARD', end_rewardLabelStyle);
      rewardLabel.style.fontSize = 50;

      rewardLabel.anchor.set(0.5);
      rewardLabel.x = this.renderer.width / 2;
      rewardLabel.y = this.renderer.height / 2 + 40;
      this.stage.addChild(rewardLabel);

      var nbOrbs = Math.floor(this.whackAMoleScore / 3000);
      var nbOrbsLabel = new PIXI.Text(nbOrbs + ' orb' + (nbOrbs > 1 ? 's' : ''), end_rewardStyle);
      nbOrbsLabel.anchor.set(0.5);
      nbOrbsLabel.x = this.renderer.width / 2;
      nbOrbsLabel.y = this.renderer.height / 2 + 100;
      this.stage.addChild(nbOrbsLabel);
    }
  }, {
    key: 'generateWhackAMoleScene',
    value: function generateWhackAMoleScene() {
      var _this5 = this;

      this.whackAMoleScore = 0;
      this.gameOver = false;
      this.cleanScene();

      this.stage.removeChild(this.spellingHud.container);
      this.whackAMoleHud = new __WEBPACK_IMPORTED_MODULE_6__WhackAMoleHud__["a" /* default */](this.renderer.width, this.renderer.height);
      this.whackAMoleHud.container.zIndex = 6;
      this.stage.addChild(this.whackAMoleHud.container);
      this.stage.updateLayersOrder();
      this.whackAMoleHud.setTime(this.score);

      this.startTimer();

      var ticker = 0;
      var interv = setInterval(function () {
        var time = parseInt(_this5.whackAMoleHud.getTime());
        if (time < 1) {
          clearInterval(interv);
        }
        ticker++;
        if (ticker % 1 === 0) {
          var voidspider = new __WEBPACK_IMPORTED_MODULE_4__VoidMonster__["a" /* default */](_this5.stage, _this5.originalStageSize, Math.random() * _this5.renderer.width, 1, 1, Math.random() * 1000, _this5.incrementScore.bind(_this5));
          _this5.stage.addChild(voidspider.container);
          _this5.stage.updateLayersOrder();
        }

        if (ticker % 4 === 0) {
          var ick = new __WEBPACK_IMPORTED_MODULE_7__IckMonster__["a" /* default */](_this5.stage, _this5.originalStageSize, Math.random() * _this5.renderer.width, 1, 3, Math.random() * 1000, _this5.incrementScore.bind(_this5));
          _this5.stage.addChild(ick.container);
          _this5.stage.updateLayersOrder();
        }

        if (ticker % 5 === 0) {
          var stiffle = new __WEBPACK_IMPORTED_MODULE_8__StifleMonster__["a" /* default */](_this5.stage, _this5.originalStageSize, Math.random() * _this5.renderer.width, 1, 10, Math.random() * 1000, _this5.incrementScore.bind(_this5));
          _this5.stage.addChild(stiffle.container);
          _this5.stage.updateLayersOrder();
        }
      }, 1000);
    }
  }, {
    key: 'renderScoreLabel',
    value: function renderScoreLabel() {
      this.whackScoreLabel = new PIXI.Text('0', hudStyle);
      this.whackScoreLabel.x = 10;
      this.whackScoreLabel.y = 70;
      this.stage.addChild(this.whackScoreLabel);
    }
  }, {
    key: 'rerender',
    value: function rerender() {
      this.hintButton.x = this.renderer.width / 2;
      this.hintButton.y = 27;
    }
  }, {
    key: 'canUseHint',
    value: function canUseHint() {
      return this.availableHints > 0 && !this.word.usedHint;
    }
  }, {
    key: 'displayHint',
    value: function displayHint() {
      if (this.canUseHint()) {
        this.spellingHud.setHint(this.word.hint);
        this.availableHints--;
        this.word.usedHint = true;
      }
    }
  }]);

  return Game;
}();

/* harmony default export */ __webpack_exports__["a"] = (Game);

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(79), __esModule: true };

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(80);
var $Object = __webpack_require__(4).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(8);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(7), 'Object', { defineProperty: __webpack_require__(9).f });


/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);



var Tile = function () {
  function Tile(game, index, x, y, length, acceptedLetter) {
    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Tile);

    this.acceptedLetter = acceptedLetter;
    this.x = x;
    this.y = y;
    this.index = index;
    this.length = length;
    this.graphics = new PIXI.Graphics();

    this.graphics.beginFill(0xFF3300);
    this.graphics.lineStyle(10, 0xffd900, 1);
    this.game = game;
    this.graphics.moveTo(x, y);
    this.graphics.lineTo(x + length, y);
    this.graphics.endFill();

    this.game.stage.addChild(this.graphics);
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Tile, [{
    key: "highlight",
    value: function highlight() {
      this.graphics.tint = 0xffff;
    }
  }, {
    key: "resetColor",
    value: function resetColor() {
      this.graphics.tint = 0xffffff;
    }
  }]);

  return Tile;
}();

/* harmony default export */ __webpack_exports__["a"] = (Tile);

/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);



function getFontStyle(word) {

  var fontSize = 120;
  if (word.split('').length > 1) {
    fontSize = 30;
  }

  return new PIXI.TextStyle({
    fontFamily: 'LibreBaskerville',
    fontSize: fontSize,
    fill: '#fff',
    stroke: '#fff',
    strokeThickness: fontSize / 15,
    wordWrap: true,
    wordWrapWidth: 440
  });
}

var Letter = function () {
  function Letter(game, letter, x, y, rightIndex, tiles) {
    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Letter);

    this.L = letter;
    this.game = game;
    var text = new PIXI.Text(letter, getFontStyle(letter));
    var texture = text.generateTexture(this.game.renderer);
    this.letter = new PIXI.Sprite(texture);
    this.letter.zIndex = 6;
    this.tiles = tiles;
    this.correct = false;
    this.rightIndex = rightIndex;
    this.placedIndex = -1;
    this.target = tiles[rightIndex];

    this.letter.interactive = true;

    this.letter.buttonMode = true;

    this.letter.anchor = { x: 0.5, y: 1

      // setup events for mouse + touch using
    };this.letter.on('pointerdown', this.onDragStart.bind(this)).on('pointerup', this.onDragEnd.bind(this)).on('pointerupoutside', this.onDragEnd.bind(this)).on('pointermove', this.onDragMove.bind(this));

    this.letter.x = x;
    this.letter.y = y;

    this.moveTo = this.moveTo.bind(this);
    // add it to the stage
    this.game.stage.addChild(this.letter);
    this.game.stage.updateLayersOrder();
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Letter, [{
    key: 'moveTo',
    value: function moveTo(x, y) {
      this.letter.position.x = x;
      this.letter.position.y = y;
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(event) {
      this.letter.data = event.data;
      this.letter.alpha = 0.5;
      this.letter.anchor = { x: 0.5, y: 0.5 };
      this.letter.dragging = true;
    }
  }, {
    key: 'onDragEnd',
    value: function onDragEnd() {
      var _this = this;

      this.letter.alpha = 1;
      this.letter.dragging = false;
      // set the interaction data to null
      this.letter.data = null;

      this.letter.anchor = { x: 0.5, y: 1 };
      if (this.L === ',') {
        this.letter.anchor = { x: 0.5, y: 0.7 };
      }

      this.tiles.map(function (tile) {
        if (_this.isHoverTile(tile)) {
          _this.placedIndex = tile.index;
          _this.correct = tile.acceptedLetter === _this.L;
          tile.resetColor();
          _this.letter.position.x = tile.x + tile.length / 2;
          _this.letter.position.y = tile.y;
        }
      });
      this.game.calculateScore();
    }
  }, {
    key: 'onDragMove',
    value: function onDragMove() {
      var _this2 = this;

      if (this.letter.dragging) {
        var newPosition = this.letter.data.getLocalPosition(this.letter.parent);
        this.letter.position.x = newPosition.x;
        this.letter.position.y = newPosition.y;

        this.tiles.map(function (tile) {
          if (_this2.isHoverTile(tile)) {
            tile.highlight();
          } else {
            tile.resetColor();
          }
        });
      }
    }
  }, {
    key: 'isHoverTile',
    value: function isHoverTile(tile) {
      return this.letter.position.x > tile.x && this.letter.position.x < tile.x + tile.length && this.letter.position.y < tile.y && this.letter.position.y > tile.y - 150;
    }
  }]);

  return Letter;
}();

/* harmony default export */ __webpack_exports__["a"] = (Letter);

/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);



var VoidMonster = function () {
  function VoidMonster(stage, originalStageSize, x, y) {
    var life = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    var _this = this;

    var delay = arguments[5];
    var onDeath = arguments[6];

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, VoidMonster);

    this.life = life;
    this.voidSprite = new PIXI.Graphics();
    this.reward = 100;
    this.x = x;
    this.onDeath = onDeath;

    var voidTexture = PIXI.Texture.fromImage('/assets/void.png');
    var voidTexture2 = new PIXI.Texture(voidTexture);
    this.voidSprite = new PIXI.Sprite(voidTexture2);
    this.voidSprite.scale.x = 0.3;
    this.voidSprite.scale.y = 0.3;
    this.voidSprite.position.x = x;
    this.voidSprite.position.y = -150;

    this.hintButton;
    this.hintLabel;

    this.goUp = false;
    this.tail = new PIXI.Graphics();

    this.container = new PIXI.Container();
    this.stage = stage;
    this.container.addChild(this.tail);

    this.tail.addChild(this.voidSprite);

    this.maxDrop = Math.random() * (originalStageSize.h / 2) + originalStageSize.h / 4;
    this.speed = Math.random() * 15 + 5;

    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.on('pointerdown', function () {
      _this.onTap();
    }.bind(this));

    setTimeout(function () {
      _this.animate();
    }, delay);
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(VoidMonster, [{
    key: 'onTap',
    value: function onTap() {
      if (this.life > 1) {
        this.life--;
      } else {
        this.onDeath(this.reward);this.remove();
      }
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.stage.removeChild(this.container);
    }
  }, {
    key: 'animate',
    value: function animate() {

      this.tail.clear();

      this.tail.beginFill(0xffffff, 1).moveTo(this.x + 70, 0).lineTo(this.x + 73, 0).lineTo(this.x + 73, this.voidSprite.position.y + 90).lineTo(this.x + 70, this.voidSprite.position.y + 90);

      if (this.voidSprite.position.y > this.maxDrop || this.goUp) {
        this.goUp = true;
        this.voidSprite.position.y -= this.speed;

        if (this.voidSprite.position.y < -100) {
          this.remove();
          this.goUp = false;
        }
      } else {

        this.voidSprite.position.y += this.speed;
      }

      requestAnimationFrame(this.animate.bind(this));
    }
  }]);

  return VoidMonster;
}();

/* harmony default export */ __webpack_exports__["a"] = (VoidMonster);

/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);


var hudStyle = new PIXI.TextStyle({
  fontFamily: "NZK",
  fontSize: 25,
  fill: '#000'
});

var hintHudStyle = new PIXI.TextStyle({
  fontFamily: "NZK",
  fontSize: 25,
  fill: '#FFF'
});

var hintStyle = new PIXI.TextStyle({
  fontFamily: "NZK",
  fontSize: 30,
  fill: '#B9FF00'
});

var SpellingGameHud = function () {
  function SpellingGameHud(width, height, displayHint) {
    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, SpellingGameHud);

    this.displayHint = displayHint;
    this.width = width;
    this.height = height;
    this.container = new PIXI.Container();
    this.container.position.x = 0;
    this.container.position.y = 0;
    this.renderTimeScore();
    this.renderLevelLabel();
    this.renderHintButton();
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(SpellingGameHud, [{
    key: "createBlock",
    value: function createBlock(x, y, height, width) {
      var blockTexture = PIXI.Texture.fromImage('/assets/block.png');
      var block = new PIXI.Sprite(blockTexture);
      block.height = height;
      block.width = width;
      block.position.x = x;
      block.position.y = y;
      return block;
    }
  }, {
    key: "renderLevelLabel",
    value: function renderLevelLabel() {
      var texture = PIXI.Texture.fromImage('./assets/level.png');
      var sprite = new PIXI.Sprite(texture);

      sprite.height = 50;
      sprite.width = 150;
      sprite.position.x = sprite.position.y = 10;
      this.container.addChild(sprite);

      var levelText = new PIXI.Text('Level', hudStyle);
      levelText.setText('Level');
      levelText.x = 20;
      levelText.y = 20;
      this.container.addChild(levelText);

      this.levelLabel = new PIXI.Text('Level', hudStyle);
      this.levelLabel.setText('0');
      this.levelLabel.x = 125;
      this.levelLabel.y = 20;
      this.container.addChild(this.levelLabel);
    }
  }, {
    key: "createRectangle",
    value: function createRectangle(x, y, height, width, color) {
      var rectangle = new PIXI.Graphics();
      rectangle.beginFill(color);
      rectangle.lineStyle(10, color);
      rectangle.moveTo(x, y);
      rectangle.lineTo(x + width, y);
      rectangle.lineTo(x + width, y + height);
      rectangle.lineTo(x, y + height);
      rectangle.endFill();
      return rectangle;
    }
  }, {
    key: "renderTimeScore",
    value: function renderTimeScore() {
      var texture = PIXI.Texture.fromImage('./assets/time.png');
      var sprite = new PIXI.Sprite(texture);

      sprite.height = 50;
      sprite.width = 100;
      sprite.position.x = this.width - 120;
      sprite.position.y = 10;
      this.container.addChild(sprite);

      this.scoreLabel = new PIXI.Text('0', hudStyle);
      this.scoreLabel.x = this.width - 70;
      this.scoreLabel.y = 20;
      this.container.addChild(this.scoreLabel);
    }
  }, {
    key: "setLevel",
    value: function setLevel(n) {
      this.levelLabel.setText('' + n);
    }
  }, {
    key: "setScore",
    value: function setScore(n) {
      this.scoreLabel.setText(n + '');
    }
  }, {
    key: "renderHintButton",
    value: function renderHintButton() {
      var _this = this;

      var texture = PIXI.Texture.fromImage('./assets/hint.png');
      var sprite = new PIXI.Sprite(texture);

      sprite.scale.x = 0.06;
      sprite.scale.y = 0.06;
      sprite.position.x = this.width - 170;
      sprite.position.y = this.height - 60;
      this.container.addChild(sprite);

      this.hintLabel = new PIXI.Text('Hint', hintHudStyle);
      this.hintLabel.x = this.width - 150;
      this.hintLabel.y = this.height - 50;
      this.container.addChild(this.hintLabel);

      this.hintButton = sprite;
      this.hintButton.interactive = true;
      this.hintButton.buttonMode = true;

      this.hintButton.on('pointerdown', function () {
        _this.displayHint();
      });
    }
  }, {
    key: "setHint",
    value: function setHint(hint) {
      this.hintLabel.style = hintStyle;
      this.hintLabel.setText(hint);
    }
  }, {
    key: "clearHint",
    value: function clearHint() {
      this.hintLabel.setText('');
    }
  }]);

  return SpellingGameHud;
}();

/* harmony default export */ __webpack_exports__["a"] = (SpellingGameHud);

/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);


var hudStyle = new PIXI.TextStyle({
  fontFamily: "NZK",
  fontSize: 25,
  fill: '#000'
});

var WhackAMoleHud = function () {
  function WhackAMoleHud(width, height, displayHint) {
    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, WhackAMoleHud);

    this.displayHint = displayHint;
    this.width = width;
    this.height = height;
    this.container = new PIXI.Container();
    this.container.position.x = 0;
    this.container.position.y = 0;

    // Score Label

    this.renderScore();
    this.renderTime();
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(WhackAMoleHud, [{
    key: 'renderScore',
    value: function renderScore() {
      this.scoreLabel = new PIXI.Text('0', hudStyle);
      this.scoreLabel.x = 130;
      this.scoreLabel.y = 60;
      this.container.addChild(this.scoreLabel);
    }
  }, {
    key: 'renderTime',
    value: function renderTime() {
      var texture = PIXI.Texture.fromImage('./assets/time.png');
      var sprite = new PIXI.Sprite(texture);

      sprite.height = 50;
      sprite.width = 100;
      sprite.position.x = this.width - 120;
      sprite.position.y = 10;
      this.container.addChild(sprite);

      this.timeLabel = new PIXI.Text('0', hudStyle);
      this.timeLabel.x = this.width - 70;
      this.timeLabel.y = 20;
      this.container.addChild(this.timeLabel);
    }
  }, {
    key: 'createBlock',
    value: function createBlock(x, y, height, width) {
      var blockTexture = PIXI.Texture.fromImage('/assets/block.png');
      var block = new PIXI.Sprite(blockTexture);
      block.height = height;
      block.width = width;
      block.position.x = x;
      block.position.y = y;
      return block;
    }
  }, {
    key: 'setLevel',
    value: function setLevel(name) {
      this.levelLabel.setText(name);
    }
  }, {
    key: 'setTime',
    value: function setTime(n) {
      this.timeLabel.setText(n + '');
    }
  }, {
    key: 'setScore',
    value: function setScore(n) {
      this.scoreLabel.setText(n);
    }
  }, {
    key: 'getTime',
    value: function getTime() {
      return this.timeLabel.text;
    }
  }]);

  return WhackAMoleHud;
}();

/* harmony default export */ __webpack_exports__["a"] = (WhackAMoleHud);

/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);



var IckMonster = function () {
  function IckMonster(stage, originalStageSize, x, y) {
    var life = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 3;

    var _this = this;

    var delay = arguments[5];
    var onDeath = arguments[6];

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, IckMonster);

    this.life = life;
    this.reward = 500;
    this.voidSprite = new PIXI.Graphics();
    this.x = x;
    this.stage = stage;
    this.width = originalStageSize.w;
    this.ticker = 0;
    var ickTexture = PIXI.Texture.fromImage('/assets/ick-dialogue-01.png');
    var ickTexture2 = new PIXI.Texture(ickTexture);
    this.ickSprite = new PIXI.Sprite(ickTexture2);
    this.ickSprite.scale.x = 0.5;
    this.ickSprite.scale.y = 0.5;

    this.ickSprite.anchor = { x: 0, y: 1 };
    this.ickSprite.position.x = -100;

    this.ickSprite.position.y = originalStageSize.h - 100;
    this.ickSprite.zIndex = -1;

    this.onDeath = onDeath;

    this.container = new PIXI.Container();
    this.container.addChild(this.ickSprite);

    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.on('pointerdown', function () {
      _this.onTap();
    }.bind(this));

    setTimeout(function () {
      _this.animate();
    }, delay);
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(IckMonster, [{
    key: 'onTap',
    value: function onTap() {
      if (this.life > 1) {
        this.life--;
        this.ickSprite.anchor.y = 1;
        this.ickSprite.scale.y -= 0.1;
      } else {
        this.onDeath(this.reward);this.remove();
      }
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.stage.removeChild(this.container);
    }
  }, {
    key: 'animate',
    value: function animate() {
      // ANIMATE ICK HERE

      if (this.ickSprite.position.x > 110 || this.goBack) {
        this.goBack = true;
        if (this.ticker > Math.random() * 30 + 30) {
          this.ickSprite.position.x -= Math.random() * 3 + 5;
        } else {
          this.ticker++;
        }
      } else {
        this.ickSprite.position.x += Math.random() * 3 + 5;
      }
      requestAnimationFrame(this.animate.bind(this));
    }
  }]);

  return IckMonster;
}();

/* harmony default export */ __webpack_exports__["a"] = (IckMonster);

/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);



var StifleMonster = function () {
  function StifleMonster(stage, originalStageSize, x, y) {
    var life = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;

    var _this = this;

    var delay = arguments[5];
    var onDeath = arguments[6];

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, StifleMonster);

    this.life = life;
    this.reward = 1000;
    this.voidSprite = new PIXI.Graphics();
    this.x = x;
    this.stage = stage;
    this.width = this.stage.width;
    this.height = this.stage.height;
    this.ticker = 0;

    var stifleTexture = PIXI.Texture.fromImage('/assets/stifle.png');
    var stifleTexture2 = new PIXI.Texture(stifleTexture);
    this.stifleSprite = new PIXI.Sprite(stifleTexture2);
    this.stifleSprite.scale.x = 0.8;
    this.stifleSprite.scale.y = 0.8;

    this.fromLeft = Math.random() > 0.5;

    this.stifleSprite.anchor = { x: 0.5, y: 1 };
    this.stifleSprite.position.x = window.innerWidth / 2;
    this.stifleSprite.position.y = window.innerHeight + 400;

    this.onDeath = onDeath;

    this.container = new PIXI.Container();
    this.container.addChild(this.stifleSprite);

    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.on('pointerdown', function () {
      _this.onTap();
    }.bind(this));
    stage.addChild(this.container);

    setTimeout(function () {
      _this.animate();
    }, delay);
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(StifleMonster, [{
    key: 'onTap',
    value: function onTap() {
      if (this.life > 1) {
        this.life--;
        this.stifleSprite.anchor.y = 1;
        this.stifleSprite.scale.y -= 0.04;
      } else {
        this.onDeath(this.reward);this.remove();
      }
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.stage.removeChild(this.container);
    }
  }, {
    key: 'animate',
    value: function animate() {

      if (this.stifleSprite.position.y < window.innerHeight - 100 || this.goDown) {
        this.goDown = true;

        if (this.ticker > Math.random() * 30 + 50) {
          this.stifleSprite.position.y += 5;
        } else {
          this.ticker++;
        }
        if (this.stifleSprite.position.y > window.innerHeight + 390) {
          this.remove();
          this.goDown = false;
        }
      } else {
        this.stifleSprite.position.y -= 5;
      }

      requestAnimationFrame(this.animate.bind(this));
    }
  }]);

  return StifleMonster;
}();

/* harmony default export */ __webpack_exports__["a"] = (StifleMonster);

/***/ }),
/* 88 */
/***/ (function(module, exports) {

module.exports = {"year1/2":[{"word":"off","hint":"on","sentence":"This|button|is|about|to|come|off."},{"word":"well","hint":"ill","sentence":"Business|is|going|well."},{"word":"miss","hint":"hit","sentence":"He|just|missed|being|caught."},{"word":"buzz","hint":"bee","sentence":"I'll|buzz|along|now."},{"word":"back","hint":"front","sentence":"At|the|back|of|a|hall."},{"word":"bank","hint":"money","sentence":"He|went|to|the|bank."},{"word":"think","hint":"idea","sentence":"Think|carefully|before|you|begin."},{"word":"honk","hint":"horn","sentence":"The|driver|honked|his|horn|impatiently."},{"word":"sunk","hint":"underground","sentence":"The|sand|castle|sunk."},{"word":"pocket","hint":"wallet","sentence":"She|reached|into|her|pocket."},{"word":"rabbit","hint":"carrot","sentence":"The|rabbit|hopped|around|the|garden."},{"word":"carrot","hint":"rabbit","sentence":"The|rabbit|enjoyed|the|carrot."},{"word":"thunder","hint":"noise","sentence":"It|thundered|last|night."},{"word":"sunset","hint":"sunrise","sentence":"What|time|is|the|sunset|this|evening?"},{"word":"catch","hint":"ball","sentence":"Can|you|catch|a|fish?"},{"word":"fetch","hint":"stick","sentence":"The|dog|played|fetch|with|his|owner."},{"word":"kitchen","hint":"cook","sentence":"The|kitchen|smelled|delicious."},{"word":"hutch","hint":"rabbit","sentence":"The|rabbit|went|into|the|hutch.|"},{"word":"have","hint":"own","sentence":"I|have|a|new|pencil|case."},{"word":"live","hint":"home","sentence":"Where|do|they|live?"},{"word":"give","hint":"offer","sentence":"Give|the|dog|a|bone."},{"word":"cats","hint":"dogs","sentence":"How|many|cats|does|she|have?"},{"word":"dogs","hint":"cats","sentence":"There|are|dogs|in|that|house.|"},{"word":"spends","hint":"money","sentence":"He|spends|a|lot|of|money."},{"word":"rocks","hint":"stones","sentence":"Rocks|can|be|slippery."},{"word":"thanks","hint":"please","sentence":"Thanks|for|the|help.|"},{"word":"catches","hint":"thrown","sentence":"He|catches|the|ball|very|easily."},{"word":"hunter","hint":"stay hidden","sentence":"The|hunter|stayed|very|quiet."},{"word":"buzzing","hint":"alarm","sentence":"The|alarm|was|buzzing|loudly."},{"word":"buzzed","hint":"bee","sentence":"The|bee|buzzed|are|her|head."},{"word":"buzzer","hint":"wake up","sentence":"The|buzzer|woke|her|up.|"},{"word":"jumping","hint":"spring","sentence":"He|was|jumping|on|the|trompoline."},{"word":"jumped","hint":"sprung","sentence":"She|jumped|very|high."},{"word":"jumper","hint":"warm","sentence":"He|wore|a|warm|jumper|to|the|party."},{"word":"fresher","hint":"newer","sentence":"The|tomato|was|fresher|than|the|carrot."},{"word":"freshest","hint":"newest","sentence":"She|looked|for|the|freshest|vegetable."},{"word":"quicker","hint":"faster","sentence":"He|ran|quicker|than|ever|before.|"},{"word":"quickest","hint":"fastest","sentence":"She's|the|quickest|in|her|class."},{"word":"rain","hint":"wet","sentence":"The|rain|fell|heavily|on|them.|"},{"word":"wait","hint":"pause","sentence":"Let's|wait|till|it|stops|raining."},{"word":"train","hint":"car","sentence":"The|train|pulled|into|the|station"},{"word":"paid","hint":"money","sentence":"The|man|was|paid|his|wage.|"},{"word":"afraid","hint":"fear","sentence":"I|am|afraid|of|the|haunted|house.|"},{"word":"oil","hint":"car","sentence":"The|car|needed|more|oil.|"},{"word":"join","hint":"meet","sentence":"Will|you|join|our|game?"},{"word":"coin","hint":"money","sentence":"I|have|a|pound|coin.|"},{"word":"point","hint":"finger","sentence":"Don't|point|your|finger|at|me!"},{"word":"soil","hint":"land","sentence":"The|soil|was|wet|after|the|rain.|"},{"word":"day","hint":"night","sentence":"What|day|is|it|today?"},{"word":"play","hint":"fun","sentence":"Will|you|play|football|with|me?"},{"word":"say","hint":"speak","sentence":"What|did|the|teacher|say?"},{"word":"way","hint":"far","sentence":"It|is|a|long|way|to|the|cinema.|"},{"word":"stay","hint":"stop","sentence":"Please|stay|here|with|me.|"},{"word":"boy","hint":"girl","sentence":"The|boy|was|swimming.|"},{"word":"toy","hint":"action figure","sentence":"The|toy|lay|on|the|floor.|"},{"word":"enjoy","hint":"happy","sentence":"Did|you|enjoy|the|party?"},{"word":"annoy","hint":"upset","sentence":"He|annoyed|his|sister."},{"word":"made","hint":"created","sentence":"Dad|made|a|cake.|"},{"word":"came","hint":"went","sentence":"He|came|home|from|school|happy."},{"word":"same","hint":"similar","sentence":"They|ate|the|same|lunch|as|yesterday."},{"word":"take","hint":"give","sentence":"Will|you|take|me|to|the|cinema?"},{"word":"safe","hint":"danger","sentence":"When|is|it|safe|to|cross|the|road?"},{"word":"these","hint":"some","sentence":"These|children|are|playing|nicely.|"},{"word":"theme","hint":"park","sentence":"The|theme|park|is|so|much|fun!"},{"word":"complete","hint":"success","sentence":"Complete|your|homework|before|dinner."},{"word":"five","hint":"number","sentence":"Give|me|a|high|five|please!"},{"word":"ride","hint":"horse","sentence":"I|like|to|ride|my|bike."},{"word":"like","hint":"enjoy","sentence":"I|like|eating|chocolate|cake.|"},{"word":"time","hint":"watch","sentence":"It|is|dinner|time|now.|"},{"word":"side","hint":"team","sentence":"Please|use|the|side|entrance."},{"word":"home","hint":"house","sentence":"He|left|home|early|in|the|morning."},{"word":"those","hint":"objects","sentence":"Can|you|help|with|those|bags?"},{"word":"woke","hint":"sleep","sentence":"I|woke|up|early|this|morning."},{"word":"hope","hint":"dream","sentence":"I|hope|you|have|a|great|time!"},{"word":"hole","hint":"trap","sentence":"The|rabbit|went|down|a|hole.|"},{"word":"car","hint":"drive","sentence":"The|family|bought|a|new|car."},{"word":"start","hint":"begin","sentence":"It|is|time|to|start|the|race."},{"word":"park","hint":"trees","sentence":"Are|you|going|to|the|park?"},{"word":"arm","hint":"leg","sentence":"The|boy|has|very|long|arms."},{"word":"garden","hint":"flowers","sentence":"They|have|a|beautiful|garden."},{"word":"see","hint":"hear","sentence":"I|can|see|you|from|up|here!"},{"word":"tree","hint":"acorn","sentence":"The|tree|has|green|leaves."},{"word":"green","hint":"grass","sentence":"She|lay|down|on|the|green|grass."},{"word":"meet","hint":"gather","sentence":"Very|pleased|to|meet|you."},{"word":"week","hint":"time","sentence":"What|are|you|doing|this|week?"},{"word":"sea","hint":"land","sentence":"The|boat|floated|on|the|sea."},{"word":"dream","hint":"sleep","sentence":"Did|you|have|a|dream|last|night?"},{"word":"meat","hint":"pie","sentence":"Some|people|enjoy|eating|meat."},{"word":"read","hint":"book","sentence":"What|is|your|favourite|book?"},{"word":"head","hint":"hat","sentence":"She|wore|a|pink|hat|on|her|head."},{"word":"bread","hint":"sandwich","sentence":"I|love|eating|bread!"},{"word":"meant","hint":"intention","sentence":"You|are|supposed|to|follow|the|rules."},{"word":"instead","hint":"rather","sentence":"Can|I|have|an|apple|instead?"},{"word":"read","hint":"write","sentence":"I|read|a|book|yesterday."},{"word":"her","hint":"girl","sentence":"Do|you|like|her|dress?"},{"word":"term","hint":"expression","sentence":"I'm|going|to|work|hard|this|term!"},{"word":"verb","hint":"action","sentence":"My|teacher|told|me|to|use|a|verb."},{"word":"person","hint":"you","sentence":"You|are|my|favourite|person."},{"word":"girl","hint":"boy","sentence":"The|girl|is|very|well|behaved."},{"word":"bird","hint":"fly","sentence":"Can|you|see|the|bird|in|the|tree?"},{"word":"shirt","hint":"collar","sentence":"Do|you|like|my|shirt?"},{"word":"first","hint":"winner","sentence":"She|finished|first|in|the|race."},{"word":"third","hint":"bronze","sentence":"He|finished|third|in|the|race."},{"word":"turn","hint":"left","sentence":"It|is|your|turn|to|clean|up."},{"word":"hurt","hint":"arm","sentence":"I|hurt|my|arm."},{"word":"church","hint":"wedding","sentence":"I|went|to|church|on|Sunday."},{"word":"burst","hint":"fast","sentence":"The|bottle|burst."},{"word":"Thursday","hint":"day","sentence":"It|is|Thursday|tomorrow."},{"word":"June","hint":"month","sentence":"My|birthday|is|in|June."},{"word":"rule","hint":"guide","sentence":"You|must|follow|the|rules|in|class."},{"word":"rude","hint":"naughty","sentence":"The|little|boy|was|rude|to|his|Dad."},{"word":"tube","hint":"rubber","sentence":"They|used|a|test|tube|for|the|experiment."},{"word":"tune","hint":"song","sentence":"Can|you|sing|in|tune?"},{"word":"food","hint":"eat","sentence":"Would|you|like|some|food?"},{"word":"pool","hint":"swim","sentence":"It|is|cool|in|the|pool."},{"word":"moon","hint":"stars","sentence":"He|looked|up|at|the|moon."},{"word":"zoo","hint":"animals","sentence":"The|Night|Zoo|is|magical."},{"word":"soon","hint":"nearly","sentence":"I|will|be|home|soon."},{"word":"book","hint":"read","sentence":"I|have|written|a|book."},{"word":"took","hint":"stole","sentence":"I|took|your|car|key|this|morning."},{"word":"foot","hint":"leg","sentence":"I|kick|with|my|right|foot."},{"word":"wood","hint":"chop","sentence":"She|put|wood|on|the|fire."},{"word":"good","hint":"bad","sentence":"It|is|a|good|day."},{"word":"boat","hint":"row","sentence":"The|boat|sailed|on|the|ocean."},{"word":"coat","hint":"jacket","sentence":"Are|you|wearing|a|coat?"},{"word":"road","hint":"drive","sentence":"Be|careful|next|to|the|road."},{"word":"coach","hint":"bus","sentence":"The|coach|shouted|at|his|players."},{"word":"goal","hint":"score","sentence":"The|striker|scored|a|goal."},{"word":"toe","hint":"shoe","sentence":"I|have|a|sore|toe."},{"word":"out","hint":"in","sentence":"Get|out|of|my|classroom."},{"word":"about","hint":"round","sentence":"What|do|you|know|about|football?"},{"word":"mouth","hint":"eating","sentence":"He|opened|his|mouth|in|shock."},{"word":"around","hint":"circle","sentence":"They|ran|around|the|castle."},{"word":"sound","hint":"noise","sentence":"Did|you|hear|that|sound?"},{"word":"now","hint":"ready","sentence":"I|have|got|a|meeting|now."},{"word":"how","hint":"why?","sentence":"How|are|you|today?"}]}

/***/ })
/******/ ]);