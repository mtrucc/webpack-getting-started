/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 555:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "c": () => (/* binding */ Utils)
/* harmony export */ });
function Utils(errorOutputId) {
  // eslint-disable-line no-unused-vars
  let self = this;
  this.errorOutput = document.getElementById(errorOutputId);

  const OPENCV_URL = 'opencv.js';
  this.loadOpenCv = function (onloadCallback) {
    let script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('type', 'text/javascript');
    script.addEventListener('load', async () => {
      if (cv.getBuildInformation) {
        console.log(cv.getBuildInformation());
        onloadCallback();
      } else {
        // WASM
        if (cv instanceof Promise) {
          cv = await cv;
          console.log(cv.getBuildInformation());
          onloadCallback();
        } else {
          cv['onRuntimeInitialized'] = () => {
            console.log(cv.getBuildInformation());
            onloadCallback();
          };
        }
      }
    });
    script.addEventListener('error', () => {
      self.printError('Failed to load ' + OPENCV_URL);
    });
    script.src = OPENCV_URL;
    let node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(script, node);
  };

  this.createFileFromUrl = function (path, url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function (ev) {
      if (request.readyState === 4) {
        if (request.status === 200) {
          let data = new Uint8Array(request.response);
          cv.FS_createDataFile('/', path, data, true, false, false);
          callback();
        } else {
          self.printError(
            'Failed to load ' + url + ' status: ' + request.status
          );
        }
      }
    };
    request.send();
  };

  this.loadImageToCanvas = function (url, cavansId) {
    let canvas = document.getElementById(cavansId);
    let ctx = canvas.getContext('2d');
    let img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
    };
    img.src = url;
  };

  this.executeCode = function (textAreaId) {
    try {
      this.clearError();
      let code = document.getElementById(textAreaId).value;
      eval(code);
    } catch (err) {
      this.printError(err);
    }
  };

  this.clearError = function () {
    this.errorOutput.innerHTML = '';
  };

  this.printError = function (err) {
    if (typeof err === 'undefined') {
      err = '';
    } else if (typeof err === 'number') {
      if (!isNaN(err)) {
        if (typeof cv !== 'undefined') {
          err = 'Exception: ' + cv.exceptionFromPtr(err).msg;
        }
      }
    } else if (typeof err === 'string') {
      let ptr = Number(err.split(' ')[0]);
      if (!isNaN(ptr)) {
        if (typeof cv !== 'undefined') {
          err = 'Exception: ' + cv.exceptionFromPtr(ptr).msg;
        }
      }
    } else if (err instanceof Error) {
      err = err.stack.replace(/\n/g, '<br>');
    }
    this.errorOutput.innerHTML = err;
  };

  this.loadCode = function (scriptId, textAreaId) {
    let scriptNode = document.getElementById(scriptId);
    let textArea = document.getElementById(textAreaId);
    if (scriptNode.type !== 'text/code-snippet') {
      throw Error('Unknown code snippet type');
    }
    textArea.value = scriptNode.text.replace(/^\n/, '');
  };

  this.addFileInputHandler = function (fileInputId, canvasId) {
    let inputElement = document.getElementById(fileInputId);
    inputElement.addEventListener(
      'change',
      (e) => {
        let files = e.target.files;
        if (files.length > 0) {
          let imgUrl = URL.createObjectURL(files[0]);
          self.loadImageToCanvas(imgUrl, canvasId);
        }
      },
      false
    );
  };

  function onVideoCanPlay() {
    if (self.onCameraStartedCallback) {
      self.onCameraStartedCallback(self.stream, self.video);
    }
  }

  this.startCamera = function (resolution, callback, videoId) {
    const constraints = {
      qvga: { width: { exact: 320 }, height: { exact: 240 } },
      vga: { width: { exact: 640 }, height: { exact: 480 } },
    };
    let video = document.getElementById(videoId);
    if (!video) {
      video = document.createElement('video');
    }

    let videoConstraint = constraints[resolution];
    if (!videoConstraint) {
      videoConstraint = true;
    }

    navigator.mediaDevices
      .getUserMedia({ video: videoConstraint, audio: false })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
        self.video = video;
        self.stream = stream;
        self.onCameraStartedCallback = callback;
        video.addEventListener('canplay', onVideoCanPlay, false);
      })
      .catch(function (err) {
        self.printError('Camera Error: ' + err.name + ' ' + err.message);
      });
  };

  this.stopCamera = function () {
    if (this.video) {
      this.video.pause();
      this.video.srcObject = null;
      this.video.removeEventListener('canplay', onVideoCanPlay);
    }
    if (this.stream) {
      this.stream.getVideoTracks()[0].stop();
    }
  };
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".main.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "webpack-ts:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			179: 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkwebpack_ts"] = self["webpackChunkwebpack_ts"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(555);


const PrintImage = async (array) => {
  if (typeof window !== 'undefined') {
    // browser code
    let { default: printJS } = await __webpack_require__.e(/* import() */ 607).then(__webpack_require__.t.bind(__webpack_require__, 607, 23));

    printJS({
      printable: array,
      type: 'image',
    });
  }
};

async function LoadPdf(url, wokerUrl) {
  console.log('url', url);
  let printList = [];
  var pdfJS = window['pdfjs-dist/build/pdf'];
  console.log('window.location.origin', window.location.origin);
  pdfJS.GlobalWorkerOptions.workerSrc = wokerUrl;
  const pdf = await pdfJS.getDocument(url).promise;

  const page = await pdf.getPage(1);
  const scale = 4;
  const viewport = page.getViewport({
    scale,
  });
  const canvas = document.createElement('CANVAS');
  const canvasContext = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  const renderContext = {
    canvasContext,
    viewport,
  };
  await page.render(renderContext).promise.then((data) => {
    const newCanvas = document.createElement('canvas');
    newCanvas.width = 530 * scale;
    newCanvas.height = 200 * scale;
    const newCanvasContext = newCanvas.getContext('2d');
    newCanvasContext.drawImage(
      canvas,
      20 * scale,
      210 * scale,
      550 * scale,
      190 * scale,
      0,
      0,
      530 * scale,
      190 * scale
    );
    const dataURL = canvas.toDataURL('image/png', 1);
    console.log('dataURL', dataURL);
    printList.push(dataURL);
    return dataURL;
  });

  // const page2 = await pdf.getPage(2);
  // const viewport2 = page2.getViewport({
  //   scale: 2,
  // });
  // const canvas2 = document.createElement('CANVAS');
  // const canvasContext2 = canvas2.getContext('2d');
  // canvas2.height = viewport2.height;
  // canvas2.width = 1060;

  // const renderContext2 = {
  //   canvasContext: canvasContext2,
  //   viewport: viewport2,
  // };

  // const operators = await page2.getOperatorList();

  // const rawImgOperator = operators.fnArray
  //   .map((f, index) => (f === pdfJS.OPS.paintImageXObject ? index : null))
  //   .filter((n) => n !== null);

  // const filename = operators.argsArray[rawImgOperator[1]][0];

  // console.log('rawImgOperator', rawImgOperator);

  // console.log('operators.argsArray', operators.argsArray);

  // rawImgOperator.forEach((index) => {
  //   const filename = operators.argsArray[index][0];
  //   getImage(page2, filename, (data) => {
  //     console.log('data', data);
  //   });
  // });
  // console.log('printList', printList)

  // page2.objs.get(filename, async (arg) => {
  //   const canvas = document.createElement('canvas');
  //   canvas.width = arg.width;
  //   canvas.height = arg.height;
  //   const ctx = canvas.getContext('2d');

  //   const data = new Uint8ClampedArray(arg.width * arg.height * 4);
  //   let k = 0;
  //   let i = 0;
  //   while (i < arg.data.length) {
  //     data[k] = arg.data[i];
  //     data[k + 1] = arg.data[i + 1];
  //     data[k + 2] = arg.data[i + 2];
  //     data[k + 3] = 255;

  //     i += 3;
  //     k += 4;
  //   }
  //   const imgData = ctx.createImageData(arg.width, arg.height);
  //   imgData.data.set(data);
  //   ctx.putImageData(imgData, 0, 0);
  //   const newCanvas = document.createElement('canvas');
  //   newCanvas.width = (arg.height * 1000) / 665;
  //   newCanvas.height = arg.height;
  //   const newCanvasContext = newCanvas.getContext('2d');
  //   newCanvasContext.drawImage(
  //     canvas,
  //     0,
  //     0,
  //     newCanvas.width,
  //     newCanvas.height,
  //     0,
  //     0,
  //     newCanvas.width,
  //     newCanvas.height
  //   );

  //   const dataURL = newCanvas.toDataURL('image/png', 1);
  //   printList.push(dataURL);
  // });

  // PrintImage(printList);
  return pdf;
}

async function Run() {
  let pdf = await LoadPdf(
    'test.pdf',
    window.location.origin + '/dist/pdf.worker.js'
  );
  let pageNumber = await getPageNumber(pdf);
  if (pageNumber == 2) {
    console.log('pageNumber', pageNumber);
  }
  console.log('pageNumber', pageNumber);
}

async function getPageNumber(pdf) {
  return pdf.numPages;
}

function getImage(page, filename, callback) {
  page.objs.get(filename, async (arg) => {
    console.log('arg', arg);
    const canvas = document.createElement('canvas');
    canvas.width = arg.width;
    canvas.height = arg.height;
    const ctx = canvas.getContext('2d');

    const data = new Uint8ClampedArray(arg.width * arg.height * 4);
    let k = 0;
    let i = 0;
    while (i < arg.data.length) {
      data[k] = arg.data[i];
      data[k + 1] = arg.data[i + 1];
      data[k + 2] = arg.data[i + 2];
      data[k + 3] = 255;

      i += 3;
      k += 4;
    }
    const imgData = ctx.createImageData(arg.width, arg.height);
    imgData.data.set(data);
    ctx.putImageData(imgData, 0, 0);
    const newCanvas = document.createElement('canvas');
    newCanvas.width = (arg.height * 1000) / 665;
    newCanvas.height = arg.height;
    const newCanvasContext = newCanvas.getContext('2d');
    newCanvasContext.drawImage(
      canvas,
      0,
      0,
      newCanvas.width,
      newCanvas.height,
      0,
      0,
      newCanvas.width,
      newCanvas.height
    );

    const dataURL = newCanvas.toDataURL('image/png', 1);
    console.log('dataURL', dataURL);
    // printList.push(dataURL);
  });
}

// LoadPdf('test.pdf', window.location.origin + '/dist/pdf.worker.js');
// Run();

let utils = new _utils__WEBPACK_IMPORTED_MODULE_0__/* .Utils */ .c('errorMessage');
utils.loadImageToCanvas('test1.png', 'canvasInput');
utils.loadOpenCv(() => {
  let src = cv.imread('canvasInput');
  let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
  let lines = new cv.Mat();
  let color = new cv.Scalar(255, 0, 0);
  let low = new cv.Mat(src.rows, src.cols, src.type(), [200, 200, 200, 0]);
  let high = new cv.Mat(src.rows, src.cols, src.type(), [240, 240, 240, 255]);
  // You can try more different parameters
  // cv.inRange(src, low, high, dst);
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  cv.Canny(src, src, 50, 200, 3);

  // // You can try more different parameters
  cv.HoughLinesP(src, lines, 5, Math.PI / 180, 100, 100, 0);
  // // draw l  ines
  let ponintList = [];
  for (let i = 0; i < lines.rows; ++i) {
    let startPoint = new cv.Point(
      lines.data32S[i * 4],
      lines.data32S[i * 4 + 1]
    );
    let endPoint = new cv.Point(
      lines.data32S[i * 4 + 2],
      lines.data32S[i * 4 + 3]
    );
    console.log('startPoint, endPoint', startPoint, endPoint);
    ponintList.push(startPoint);
    ponintList.push(endPoint);
    cv.line(dst, startPoint, endPoint, color);
  }

  const ponintListX = ponintList.map((item) => item.x);
  const ponintListXMin = Math.min(...ponintListX);
  const ponintListXMax = Math.max(...ponintListX);
  const ponintListY = ponintList.map((item) => item.y);
  const ponintListYMin = Math.min(...ponintListY);
  const ponintListYMax = Math.max(...ponintListY);

  console.log('ponintListXMin, ponintListXMax', ponintListXMin, ponintListXMax);
  console.log('ponintListYMin, ponintListYMax', ponintListYMin, ponintListYMax);
  cv.imshow('canvasOutput', dst);
  src.delete();
  dst.delete();
  lines.delete();
  low.delete();
  high.delete();
});

window.LoadPdf = LoadPdf;
window.PrintImage = PrintImage;
window.getPageNumber = getPageNumber;

})();

/******/ })()
;