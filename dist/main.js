(()=>{"use strict";var __webpack_modules__={555:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function Utils(errorOutputId){let self=this;this.errorOutput=document.getElementById(errorOutputId);const OPENCV_URL="opencv.js";function onVideoCanPlay(){self.onCameraStartedCallback&&self.onCameraStartedCallback(self.stream,self.video)}this.loadOpenCv=function(e){let t=document.createElement("script");t.setAttribute("async",""),t.setAttribute("type","text/javascript"),t.addEventListener("load",(async()=>{cv.getBuildInformation?(console.log(cv.getBuildInformation()),e()):cv instanceof Promise?(cv=await cv,console.log(cv.getBuildInformation()),e()):cv.onRuntimeInitialized=()=>{console.log(cv.getBuildInformation()),e()}})),t.addEventListener("error",(()=>{self.printError("Failed to load "+OPENCV_URL)})),t.src=OPENCV_URL;let r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)},this.createFileFromUrl=function(e,t,r){let a=new XMLHttpRequest;a.open("GET",t,!0),a.responseType="arraybuffer",a.onload=function(n){if(4===a.readyState)if(200===a.status){let t=new Uint8Array(a.response);cv.FS_createDataFile("/",e,t,!0,!1,!1),r()}else self.printError("Failed to load "+t+" status: "+a.status)},a.send()},this.loadImageToCanvas=function(e,t){let r=document.getElementById(t),a=r.getContext("2d"),n=new Image;n.crossOrigin="anonymous",n.onload=function(){r.width=n.width,r.height=n.height,a.drawImage(n,0,0,n.width,n.height)},n.src=e},this.executeCode=function(textAreaId){try{this.clearError();let code=document.getElementById(textAreaId).value;eval(code)}catch(e){this.printError(e)}},this.clearError=function(){this.errorOutput.innerHTML=""},this.printError=function(e){if(void 0===e)e="";else if("number"==typeof e)isNaN(e)||"undefined"!=typeof cv&&(e="Exception: "+cv.exceptionFromPtr(e).msg);else if("string"==typeof e){let t=Number(e.split(" ")[0]);isNaN(t)||"undefined"!=typeof cv&&(e="Exception: "+cv.exceptionFromPtr(t).msg)}else e instanceof Error&&(e=e.stack.replace(/\n/g,"<br>"));this.errorOutput.innerHTML=e},this.loadCode=function(e,t){let r=document.getElementById(e),a=document.getElementById(t);if("text/code-snippet"!==r.type)throw Error("Unknown code snippet type");a.value=r.text.replace(/^\n/,"")},this.addFileInputHandler=function(e,t){document.getElementById(e).addEventListener("change",(e=>{let r=e.target.files;if(r.length>0){let e=URL.createObjectURL(r[0]);self.loadImageToCanvas(e,t)}}),!1)},this.startCamera=function(e,t,r){let a=document.getElementById(r);a||(a=document.createElement("video"));let n={qvga:{width:{exact:320},height:{exact:240}},vga:{width:{exact:640},height:{exact:480}}}[e];n||(n=!0),navigator.mediaDevices.getUserMedia({video:n,audio:!1}).then((function(e){a.srcObject=e,a.play(),self.video=a,self.stream=e,self.onCameraStartedCallback=t,a.addEventListener("canplay",onVideoCanPlay,!1)})).catch((function(e){self.printError("Camera Error: "+e.name+" "+e.message)}))},this.stopCamera=function(){this.video&&(this.video.pause(),this.video.srcObject=null,this.video.removeEventListener("canplay",onVideoCanPlay)),this.stream&&this.stream.getVideoTracks()[0].stop()}}__webpack_require__.d(__webpack_exports__,{c:()=>Utils})}},__webpack_module_cache__={},leafPrototypes,getProto,inProgress,dataWebpackPrefix;function __webpack_require__(e){var t=__webpack_module_cache__[e];if(void 0!==t)return t.exports;var r=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e](r,r.exports,__webpack_require__),r.exports}__webpack_require__.m=__webpack_modules__,getProto=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,__webpack_require__.t=function(e,t){if(1&t&&(e=this(e)),8&t)return e;if("object"==typeof e&&e){if(4&t&&e.__esModule)return e;if(16&t&&"function"==typeof e.then)return e}var r=Object.create(null);__webpack_require__.r(r);var a={};leafPrototypes=leafPrototypes||[null,getProto({}),getProto([]),getProto(getProto)];for(var n=2&t&&e;"object"==typeof n&&!~leafPrototypes.indexOf(n);n=getProto(n))Object.getOwnPropertyNames(n).forEach((t=>a[t]=()=>e[t]));return a.default=()=>e,__webpack_require__.d(r,a),r},__webpack_require__.d=(e,t)=>{for(var r in t)__webpack_require__.o(t,r)&&!__webpack_require__.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},__webpack_require__.f={},__webpack_require__.e=e=>Promise.all(Object.keys(__webpack_require__.f).reduce(((t,r)=>(__webpack_require__.f[r](e,t),t)),[])),__webpack_require__.u=e=>e+".main.js",__webpack_require__.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),inProgress={},dataWebpackPrefix="webpack-ts:",__webpack_require__.l=(e,t,r,a)=>{if(inProgress[e])inProgress[e].push(t);else{var n,o;if(void 0!==r)for(var i=document.getElementsByTagName("script"),c=0;c<i.length;c++){var _=i[c];if(_.getAttribute("src")==e||_.getAttribute("data-webpack")==dataWebpackPrefix+r){n=_;break}}n||(o=!0,(n=document.createElement("script")).charset="utf-8",n.timeout=120,__webpack_require__.nc&&n.setAttribute("nonce",__webpack_require__.nc),n.setAttribute("data-webpack",dataWebpackPrefix+r),n.src=e),inProgress[e]=[t];var s=(t,r)=>{n.onerror=n.onload=null,clearTimeout(d);var a=inProgress[e];if(delete inProgress[e],n.parentNode&&n.parentNode.removeChild(n),a&&a.forEach((e=>e(r))),t)return t(r)},d=setTimeout(s.bind(null,void 0,{type:"timeout",target:n}),12e4);n.onerror=s.bind(null,n.onerror),n.onload=s.bind(null,n.onload),o&&document.head.appendChild(n)}},__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;__webpack_require__.g.importScripts&&(e=__webpack_require__.g.location+"");var t=__webpack_require__.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),__webpack_require__.p=e})(),(()=>{var e={179:0};__webpack_require__.f.j=(t,r)=>{var a=__webpack_require__.o(e,t)?e[t]:void 0;if(0!==a)if(a)r.push(a[2]);else{var n=new Promise(((r,n)=>a=e[t]=[r,n]));r.push(a[2]=n);var o=__webpack_require__.p+__webpack_require__.u(t),i=new Error;__webpack_require__.l(o,(r=>{if(__webpack_require__.o(e,t)&&(0!==(a=e[t])&&(e[t]=void 0),a)){var n=r&&("load"===r.type?"missing":r.type),o=r&&r.target&&r.target.src;i.message="Loading chunk "+t+" failed.\n("+n+": "+o+")",i.name="ChunkLoadError",i.type=n,i.request=o,a[1](i)}}),"chunk-"+t,t)}};var t=(t,r)=>{var a,n,[o,i,c]=r,_=0;if(o.some((t=>0!==e[t]))){for(a in i)__webpack_require__.o(i,a)&&(__webpack_require__.m[a]=i[a]);c&&c(__webpack_require__)}for(t&&t(r);_<o.length;_++)n=o[_],__webpack_require__.o(e,n)&&e[n]&&e[n][0](),e[o[_]]=0},r=self.webpackChunkwebpack_ts=self.webpackChunkwebpack_ts||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var __webpack_exports__={},_utils__WEBPACK_IMPORTED_MODULE_0__;_utils__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(555),window.LoadPdf=async function(e,t,r){console.log("url",e);var a=window["pdfjs-dist/build/pdf"];console.log("window.location.origin",window.location.origin),a.GlobalWorkerOptions.workerSrc=t;const n=await a.getDocument(e).promise,o=await new Promise(((e,t)=>{if(window.opencvUtilsFlag)e&&e();else{let t=new _utils__WEBPACK_IMPORTED_MODULE_0__.c("errorMessage");t.loadOpenCv((()=>{e&&e(t),window.opencvUtilsFlag=!0}))}}));return console.log("opencvUtils",o),{pdf:n,pdfJS:a,pageNumber:n.numPages}},window.PrintImage=async e=>{if("undefined"!=typeof window){let{default:t}=await __webpack_require__.e(607).then(__webpack_require__.t.bind(__webpack_require__,607,23));t({printable:e,type:"image"})}},window.getPage1=async function(e){const t=await e.getPage(1),r=t.getViewport({scale:4}),a=document.createElement("CANVAS"),n=a.getContext("2d");a.height=r.height,a.width=r.width;const o={canvasContext:n,viewport:r};return await new Promise(((e,n)=>{t.render(o).promise.then((t=>{const n=document.createElement("canvas");n.width=2120,n.height=800;const o=document.createElement("canvas");o.id="canvasOutput",o.style.display="none",document.body.appendChild(o);const i=document.createElement("canvas");i.width=.7*r.height,i.height=r.width,i.id="canvasInput",i.style.display="none",document.body.appendChild(i),i.getContext("2d").drawImage(a,0,0,r.width,.7*r.height,0,0,r.width,.7*r.height);let c=cv.imread(i),_=cv.Mat.zeros(c.rows,c.cols,cv.CV_8UC3),s=new cv.Mat,d=new cv.Scalar(255,0,0),l=new cv.Mat(c.rows,c.cols,c.type(),[200,200,200,0]),u=new cv.Mat(c.rows,c.cols,c.type(),[240,240,240,255]);cv.inRange(c,l,u,_),cv.imshow("canvasOutput",_);let p=cv.imread("canvasOutput"),g=cv.Mat.zeros(p.rows,p.cols,cv.CV_8UC3),w=new cv.Mat;new cv.Scalar(255,0,0),cv.cvtColor(p,p,cv.COLOR_RGBA2GRAY,0),cv.Canny(p,p,50,200,3),cv.HoughLinesP(p,w,5,Math.PI/180,100,100,0);let h=[];for(let e=0;e<w.rows;++e){let t=new cv.Point(w.data32S[4*e],w.data32S[4*e+1]),r=new cv.Point(w.data32S[4*e+2],w.data32S[4*e+3]);console.log("startPoint, endPoint",t,r),h.push(t),h.push(r),cv.line(g,t,r,d)}const m=h.map((e=>e.x)),f=Math.min(...m),b=Math.max(...m),v=h.map((e=>e.y)),y=Math.min(...v),k=Math.max(...v);console.log("ponintListXMin, ponintListXMax",f,b,b-f),console.log("ponintListYMin, ponintListYMax",y,k,k-y),c.delete(),_.delete(),s.delete(),p.delete(),g.delete(),w.delete(),l.delete(),u.delete();const P=n.getContext("2d");b-f>1500&&k-y>200?P.drawImage(a,f,y,b-f,k-y,0,0,b-f,k-y):P.drawImage(a,80,840,2200,760,0,0,2120,760);const E=n.toDataURL("image/png",1);return e&&e(E),E}))}))},window.getPage2=async function(e,t,r){const a=await e.getPage(r),n=await a.getOperatorList();return await new Promise(((e,r)=>{const o=n.fnArray.map(((e,r)=>e===t.OPS.paintImageXObject?r:null)).filter((e=>null!==e));n.argsArray[o[1]][0],o.forEach((t=>{const r=n.argsArray[t][0];(function(e,t){return new Promise(((r,a)=>{e.objs.get(t,(async e=>{const{width:t,height:a}=e;if(t/a>1.6&&t/a<1.9){const t=document.createElement("canvas");t.width=e.width,t.height=e.height;const a=t.getContext("2d"),n=new Uint8ClampedArray(e.width*e.height*4);let o=0,i=0;for(;i<e.data.length;)n[o]=e.data[i],n[o+1]=e.data[i+1],n[o+2]=e.data[i+2],n[o+3]=255,i+=3,o+=4;const c=a.createImageData(e.width,e.height);c.data.set(n),a.putImageData(c,0,0);const _=document.createElement("canvas");_.width=1e3*e.height/665,_.height=e.height,_.getContext("2d").drawImage(t,0,0,_.width,_.height,0,0,_.width,_.height);const s=_.toDataURL("image/png",1);r&&r(s)}}))}))})(a,r).then((t=>{e&&e(t)}))}))}))},window.getPage3=async function(e){const t=await e.getPage(1),r=t.getViewport({scale:4}),a=document.createElement("CANVAS"),n=a.getContext("2d");a.height=r.height,a.width=r.width;const o={canvasContext:n,viewport:r};return await new Promise(((e,r)=>{t.render(o).promise.then((t=>{const r=document.createElement("canvas");r.width=2240,r.height=1080,r.getContext("2d").drawImage(a,80,1640,2200,1080,0,0,2200,1080);const n=r.toDataURL("image/png",1);return e&&e(n),n}))}))}})();