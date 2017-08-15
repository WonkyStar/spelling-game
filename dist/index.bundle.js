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
/******/ 	var hotCurrentHash = "40114f64b5c19670dee4"; // eslint-disable-line no-unused-vars
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
/******/ 	return hotCreateRequire(8)(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(13);

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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(7)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 5 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(20);
var IE8_DOM_DEFINE = __webpack_require__(21);
var toPrimitive = __webpack_require__(23);
var dP = Object.defineProperty;

exports.f = __webpack_require__(2) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
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
/* 7 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__assets_fonts_NZK_font_css__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__assets_fonts_NZK_font_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__assets_fonts_NZK_font_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_main_sass__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_main_sass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__styles_main_sass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__js_Game__ = __webpack_require__(12);





var texture = PIXI.Texture.fromImage('https://res.cloudinary.com/nzk/image/upload/f_auto,w_1250/v1474041383/uta2qdw7uxmuoc8upf0r.jpg');
var sprite = new PIXI.Sprite(texture);

setTimeout(function () {
  new __WEBPACK_IMPORTED_MODULE_2__js_Game__["a" /* default */]();
}, 100);

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 11 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Tile__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Letter__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__VoidMonster__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__SpellingGameHud__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__WhackAMoleHud__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__IckMonster__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__StifleMonster__ = __webpack_require__(31);










var hudStyle = new PIXI.TextStyle({
  fontFamily: "NZK",
  fontSize: 30,
  fill: '#D5286E'
});

var hintStyle = new PIXI.TextStyle({
  fontFamily: "NZK",
  fontSize: 30,
  fill: '#B9FF00'
});

var Game = function () {
  function Game() {
    var _this = this;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Game);

    this.availableHints = 3;
    this.usedHints = 0;
    this.level = 0;
    this.score = 40;
    this.renderer = PIXI.autoDetectRenderer(256, 256, { antialias: false, transparent: false, resolution: 1 });

    //Add the canvas to the HTML document
    document.body.appendChild(this.renderer.view);
    this.renderer.backgroundColor = 0xfffff;

    this.renderer.view.style.position = "absolute";
    this.renderer.view.style.display = "block";
    this.renderer.autoResize = true;
    this.renderer.resize(window.innerWidth, window.innerHeight);

    this.stage = new PIXI.Container();
    this.addBackground(this.stage, 'https://res.cloudinary.com/nzk/image/upload/f_auto,w_1250/v1474041383/uta2qdw7uxmuoc8upf0r.jpg');

    this.letters = [];
    this.tiles = [];
    this.correctLetters = 0;
    this.words = [{
      element: '1',
      hint: 'In a way that shows experience, knowledge, and good judgement!',
      usedHint: false
    }];
    this.currentWordIndex = 0;
    this.word = this.words[this.currentWordIndex];

    this.generateScene(this.word);

    //setTimeout((() => {
    this.renderHud();
    //}).bind(this), 1000)

    this.animate();

    window.addEventListener('resize', function () {
      var ratio = Math.min(window.innerWidth / _this.renderer.width, window.innerHeight / _this.renderer.height);
      _this.renderer.resize(window.innerWidth, window.innerHeight);
      _this.background.resize(window.innerWidth, window.innerHeight);
      _this.rerender();
    });
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Game, [{
    key: 'animate',
    value: function animate() {
      this.renderer.render(this.stage);
      //this.rerender();
      requestAnimationFrame(this.animate.bind(this));
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
    key: 'renderHud',
    value: function renderHud() {
      this.spellingHud = new __WEBPACK_IMPORTED_MODULE_5__SpellingGameHud__["a" /* default */](this.renderer.width, this.renderer.height, this.displayHint.bind(this));
      this.stage.addChild(this.spellingHud.container);
    }
  }, {
    key: 'addBackground',
    value: function addBackground(stage, image) {
      var landscapeTexture = PIXI.Texture.fromImage(image);
      var texture2 = new PIXI.Texture(landscapeTexture, new PIXI.Rectangle(0, 0, this.renderer.width, this.renderer.height));
      this.background = new PIXI.Sprite(texture2);
      this.background.anchor.x = 0;
      this.background.anchor.y = 0;
      this.background.position.x = 0;
      this.background.position.y = 0;
      stage.addChild(this.background);
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
        var length = elements.length * TILE_LENGTH;
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
    value: function incrementScore() {
      this.whackAMoleScore++;
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
          };

          var scoreLabel = new PIXI.Text('SCORE', hudStyle);
          scoreLabel.x = _this4.renderer.width / 2 - 30;
          scoreLabel.y = _this4.renderer.height / 2 - 60;
          _this4.stage.addChild(scoreLabel);

          var whackScoreLabel = new PIXI.Text(_this4.whackAMoleScore, hudStyle);
          whackScoreLabel.x = _this4.renderer.width / 2;
          whackScoreLabel.y = _this4.renderer.height / 2;
          _this4.stage.addChild(whackScoreLabel);

          clearInterval(interval);
        } else {
          _this4.whackAMoleHud.setTime(time);
        }
      }.bind(this), 1000);
    }
  }, {
    key: 'generateWhackAMoleScene',
    value: function generateWhackAMoleScene() {
      this.whackAMoleScore = 0;
      this.gameOver = false;
      this.cleanScene();

      this.stage.removeChild(this.spellingHud.container);
      this.whackAMoleHud = new __WEBPACK_IMPORTED_MODULE_6__WhackAMoleHud__["a" /* default */](this.renderer.width, this.renderer.height);
      this.stage.addChild(this.whackAMoleHud.container);
      this.whackAMoleHud.setTime(this.score);

      this.startTimer();
      this.whackAMoleHud.setLevel('Whack-A-Mole!');

      for (var i = 0; i < 15; i++) {
        if (!this.gameOver) {
          new __WEBPACK_IMPORTED_MODULE_7__IckMonster__["a" /* default */](this.stage, Math.random() * this.renderer.width, 1, 3, i * 4000 + Math.random() * 1000, this.incrementScore.bind(this));
        }
      }

      for (var i = 0; i < 60; i++) {

        if (!this.gameOver) {
          new __WEBPACK_IMPORTED_MODULE_4__VoidMonster__["a" /* default */](this.stage, Math.random() * this.renderer.width, 1, 1, i * 1000 + Math.random() * 1000, this.incrementScore.bind(this));
        }
      }

      for (var i = 0; i < 5; i++) {

        if (!this.gameOver) {
          new __WEBPACK_IMPORTED_MODULE_8__StifleMonster__["a" /* default */](this.stage, Math.random() * this.renderer.width, 1, 10, i * 10000 + Math.random() * 1000, this.incrementScore.bind(this));
        }
      }
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(14), __esModule: true };

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(15);
var $Object = __webpack_require__(5).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(16);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(2), 'Object', { defineProperty: __webpack_require__(6).f });


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(4);
var core = __webpack_require__(5);
var ctx = __webpack_require__(17);
var hide = __webpack_require__(19);
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(18);
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
/* 18 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(6);
var createDesc = __webpack_require__(24);
module.exports = __webpack_require__(2) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(2) && !__webpack_require__(7)(function () {
  return Object.defineProperty(__webpack_require__(22)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);
var document = __webpack_require__(4).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(3);
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
/* 24 */
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
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(1);
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
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);



function getFontStyle(word) {

  var fontSize = 120;
  if (word.split('').length > 1) {
    fontSize = 30;
  }

  return new PIXI.TextStyle({
    fontFamily: 'Helvetica',
    fontSize: fontSize,
    fill: ['#A72990', '#2E3990'], // gradient
    stroke: '#eee',
    strokeThickness: fontSize / 10,
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
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);



var VoidMonster = function () {
  function VoidMonster(stage, x, y) {
    var life = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    var _this = this;

    var delay = arguments[4];
    var onDeath = arguments[5];

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, VoidMonster);

    this.life = life;
    this.voidSprite = new PIXI.Graphics();

    this.x = x;
    this.onDeath = onDeath;

    this.voidSprite.beginFill(0x222222, 1).moveTo(0, -100).lineTo(0, 0).lineTo(0 + 100, 0).lineTo(0 + 100, -100);

    var voidTexture = PIXI.Texture.fromImage('/assets/void.png');
    var voidTexture2 = new PIXI.Texture(voidTexture);
    this.voidSprite = new PIXI.Sprite(voidTexture2);
    this.voidSprite.scale.x = 0.1;
    this.voidSprite.scale.y = 0.1;
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

    this.maxDrop = Math.random() * (this.stage.height / 2) + this.stage.height / 4;
    this.speed = Math.random() * 15 + 5;

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

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(VoidMonster, [{
    key: 'onTap',
    value: function onTap() {
      if (this.life > 1) {
        this.life--;
      } else {
        this.onDeath();this.remove();
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

      this.tail.beginFill(0x222222, 1).moveTo(this.x + 90, 0).lineTo(this.x + 93, 0).lineTo(this.x + 93, this.voidSprite.position.y + 50).lineTo(this.x + 90, this.voidSprite.position.y + 50);

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
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);


var hudStyle = new PIXI.TextStyle({
  fontFamily: "NZK",
  fontSize: 30,
  fill: '#D5286E'
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
    this.container.addChild(this.createBlock(-40, 0, 60, 230));
    this.container.addChild(this.createBlock(width / 4, 0, 60, width / 2));
    this.container.addChild(this.createBlock(width - 150, 0, 60, 150));

    this.levelLabel = new PIXI.Text('Level', hudStyle);
    this.levelLabel.setText('Level 0');
    this.levelLabel.x = 10;
    this.levelLabel.y = 10;
    this.container.addChild(this.levelLabel);

    // Score Label
    this.scoreLabel = new PIXI.Text('0s', hudStyle);
    this.scoreLabel.x = width - 100;
    this.scoreLabel.y = 10;
    this.container.addChild(this.scoreLabel);

    this.renderHintButton();

    // Hint Button
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
    key: "setLevel",
    value: function setLevel(n) {
      this.levelLabel.setText('Level ' + n);
    }
  }, {
    key: "setScore",
    value: function setScore(n) {
      this.scoreLabel.setText(n + 's');
    }
  }, {
    key: "renderHintButton",
    value: function renderHintButton() {
      var _this = this;

      this.hintButton = new PIXI.Text('Reveal Hint', hudStyle);
      this.hintButton.interactive = true;
      this.hintButton.buttonMode = true;
      this.hintButton.anchor.set(0.5);
      this.hintButton.x = this.width / 2;
      this.hintButton.y = 30;
      this.container.addChild(this.hintButton);

      this.hintButton.on('pointerdown', function () {
        _this.displayHint();
      });

      this.container.addChild(this.createBlock(-10, this.height - 55, 60, this.width + 10));
      this.hintLabel = new PIXI.Text('', hintStyle);
      this.hintLabel.anchor.set(0.5);
      this.hintLabel.x = this.width / 2;
      this.hintLabel.y = this.height - 30;
      this.container.addChild(this.hintLabel);
    }
  }, {
    key: "setHint",
    value: function setHint(hint) {
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
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);


var hudStyle = new PIXI.TextStyle({
  fontFamily: "NZK",
  fontSize: 30,
  fill: '#D5286E'
});

var hintStyle = new PIXI.TextStyle({
  fontFamily: "NZK",
  fontSize: 30,
  fill: '#B9FF00'
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
    this.container.addChild(this.createBlock(-40, 0, 60, 380));
    this.container.addChild(this.createBlock(120, 58, 60, 100));
    this.container.addChild(this.createBlock(width - 150, 0, 60, 150));

    this.levelLabel = new PIXI.Text('Level', hudStyle);
    this.levelLabel.setText('');
    this.levelLabel.x = 10;
    this.levelLabel.y = 10;
    this.container.addChild(this.levelLabel);

    // Score Label
    this.timeLabel = new PIXI.Text('0s', hudStyle);
    this.timeLabel.x = width - 100;
    this.timeLabel.y = 10;
    this.container.addChild(this.timeLabel);

    this.scoreLabel = new PIXI.Text('0', hudStyle);
    this.scoreLabel.x = 130;
    this.scoreLabel.y = 60;
    this.container.addChild(this.scoreLabel);

    // Hint Button
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(WhackAMoleHud, [{
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
    key: "setLevel",
    value: function setLevel(name) {
      this.levelLabel.setText(name);
    }
  }, {
    key: "setTime",
    value: function setTime(n) {
      this.timeLabel.setText(n + 's');
    }
  }, {
    key: "setScore",
    value: function setScore(n) {
      this.scoreLabel.setText(n);
    }
  }, {
    key: "getTime",
    value: function getTime() {
      return this.timeLabel.text;
    }
  }]);

  return WhackAMoleHud;
}();

/* harmony default export */ __webpack_exports__["a"] = (WhackAMoleHud);

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);



var IckMonster = function () {
  function IckMonster(stage, x, y) {
    var life = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 3;

    var _this = this;

    var delay = arguments[4];
    var onDeath = arguments[5];

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, IckMonster);

    this.life = life;
    this.voidSprite = new PIXI.Graphics();
    this.x = x;
    this.stage = stage;
    this.width = this.stage.width;
    this.ticker = 0;
    var ickTexture = PIXI.Texture.fromImage('/assets/ick-dialogue-01.png');
    var ickTexture2 = new PIXI.Texture(ickTexture);
    this.ickSprite = new PIXI.Sprite(ickTexture2);
    this.ickSprite.scale.x = 0.4;
    this.ickSprite.scale.y = 0.4;

    this.fromLeft = Math.random() > 0.5;
    if (this.fromLeft) {
      this.ickSprite.anchor = { x: 0, y: 1 };
      this.ickSprite.position.x = -280;
    } else {
      this.ickSprite.scale.x = -0.4;
      this.ickSprite.position.x = this.stage.width;
      this.ickSprite.anchor = { x: 1, y: 1 };
    }

    this.ickSprite.position.y = this.stage.height;

    this.onDeath = onDeath;

    this.container = new PIXI.Container();
    this.container.addChild(this.ickSprite);

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

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(IckMonster, [{
    key: 'onTap',
    value: function onTap() {
      if (this.life > 1) {
        this.life--;
        this.ickSprite.anchor.y = 1;
        this.ickSprite.scale.y -= 0.1;
      } else {
        this.onDeath();this.remove();
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

      if (this.fromLeft) {
        if (this.ickSprite.position.x > -2 || this.goBack) {
          this.goBack = true;
          if (this.ticker > Math.random() * 30 + 30) {
            this.ickSprite.position.x -= Math.random() * 3 + 5;
          } else {
            this.ticker++;
          }
        } else {
          this.ickSprite.position.x += Math.random() * 3 + 5;
        }
      } else {

        if (this.ickSprite.position.x < this.width - 280 || this.goBack) {
          this.goBack = true;
          if (this.ticker > Math.random() * 30 + 30) {
            this.ickSprite.position.x += Math.random() * 3 + 5;
            if (this.ickSprite.position.x > this.width) {
              this.remove();
            }
          } else {
            this.ticker++;
          }
        } else {
          this.ickSprite.position.x -= Math.random() * 3 + 5;
        }
      }

      requestAnimationFrame(this.animate.bind(this));
    }
  }]);

  return IckMonster;
}();

/* harmony default export */ __webpack_exports__["a"] = (IckMonster);

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);



var StifleMonster = function () {
  function StifleMonster(stage, x, y) {
    var life = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;

    var _this = this;

    var delay = arguments[4];
    var onDeath = arguments[5];

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, StifleMonster);

    this.life = life;
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
        this.onDeath();this.remove();
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

      if (this.stifleSprite.position.y < window.innerHeight + 10 || this.goDown) {
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

/***/ })
/******/ ]);