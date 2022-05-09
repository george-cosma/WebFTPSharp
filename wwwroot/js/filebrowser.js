/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./scripts/models/path.js":
/*!********************************!*\
  !*** ./scripts/models/path.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Path)
/* harmony export */ });
class Path {
    constructor() {
        this.path = [];
    }
    navigate(folder) {
        if (folder === "..") {
            this.navigate_backwards();
        }
        else if (this.is_valid_pathname(folder)) {
            this.path.push(folder);
        }
    }
    navigate_backwards() {
        this.path.pop();
    }
    is_valid_pathname(name) {
        if (name.includes("<"))
            return false;
        if (name.includes(">"))
            return false;
        if (name.includes(":"))
            return false;
        if (name.includes("\""))
            return false;
        if (name.includes("/"))
            return false;
        if (name.includes("\\"))
            return false;
        if (name.includes("|"))
            return false;
        if (name.includes("?"))
            return false;
        if (name.includes("*"))
            return false;
        return true;
        // TODO: handle NULL BYTES, and all non-printable chars, whilst maintaining international support
    }
}
//# sourceMappingURL=path.js.map

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
/************************************************************************/
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
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************!*\
  !*** ./scripts/filebrowser.ts ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models_path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/path */ "./scripts/models/path.js");

let path = new _models_path__WEBPACK_IMPORTED_MODULE_0__["default"]();
//const connection = new signalR.HubConnectionBuilder().withUrl("/api/hubs/filebrowser").build();
const connection = new window.signalR.HubConnectionBuilder()
    .withUrl("/api/hubs/filebrowser")
    .build();
connection.start().catch(err => console.error(err.toString()));
/*

connection.on("ReceiveMessage", function (message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you
    // should be aware of possible script injection concerns.
    li.textContent = `${message}`;
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

*/ 

})();

/******/ })()
;
//# sourceMappingURL=filebrowser.js.map