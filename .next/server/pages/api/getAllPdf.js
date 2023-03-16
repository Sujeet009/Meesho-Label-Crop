"use strict";
(() => {
var exports = {};
exports.id = 439;
exports.ids = [439];
exports.modules = {

/***/ 517:
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),

/***/ 738:
/***/ ((module) => {

module.exports = require("multer");

/***/ }),

/***/ 7:
/***/ ((module) => {

module.exports = require("pdf-lib");

/***/ }),

/***/ 448:
/***/ ((module) => {

module.exports = require("pdfjs-dist/legacy/build/pdf.js");

/***/ }),

/***/ 616:
/***/ ((module) => {

module.exports = import("next-connect");;

/***/ }),

/***/ 837:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "config": () => (/* binding */ config),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(616);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([next_connect__WEBPACK_IMPORTED_MODULE_0__]);
next_connect__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

const _ = __webpack_require__(517);
const { PDFDocument  } = __webpack_require__(7);
const pdfjsLib = __webpack_require__(448);
const multer = __webpack_require__(738);
const upload = multer();
const apiRoute = (0,next_connect__WEBPACK_IMPORTED_MODULE_0__["default"])({
    onError (error, req, res) {
        res.json({
            error: `Sorry something Happened! ${error.message}`
        });
    },
    onNoMatch (req, res) {
        res.json({
            error: `Method '${req.method}' Not Allowed`
        });
    }
});
apiRoute.use(upload.single("file"));
apiRoute.post(async (req, res)=>{
    try {
        let array = req.query.cod.split(",");
        const pdfFile = req.file;
        const quantity = req.query.qty;
        let finalArayy = [];
        const view = pdfFile.buffer;
        const deep = new Uint8Array(view);
        var pdfBytes = _.cloneDeep(deep);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        for (const ele of array){
            var quant = false;
            const pdfDoc1 = await PDFDocument.create();
            const pageCount = pdfDoc.getPageCount();
            const pdfjs = await pdfjsLib.getDocument({
                data: pdfBytes
            }).promise;
            let count = 0;
            for(let i = 0; i < pageCount; i++){
                const page = await pdfjs.getPage(i + 1);
                const content = await page.getTextContent();
                const str = content.items.find((item)=>item.str.includes(ele));
                if (quantity > 0) {
                    let indexOfQty = Number(content.items.findIndex((id)=>id.str === "Order No.")) + 6;
                    let objOfQty = content.items[indexOfQty];
                    quant = objOfQty.str === quantity ? true : false;
                } else {
                    quant = true;
                }
                if (str && quant) {
                    count += 1;
                    const textItem = content.items.find((item)=>item.str.includes("Fold Here"));
                    let textX;
                    let textY;
                    if (!textItem) {
                        const textItem = content.items.find((item)=>item.str.includes("Total"));
                        textX = textItem.transform[4];
                        textY = page.getViewport({
                            scale: 1
                        }).height - textItem.transform[5];
                        const height = page.getViewport({
                            scale: 1
                        }).height;
                        const americanFlag = await pdfDoc1.embedPage(pdfDoc.getPages()[i]);
                        const { width  } = pdfDoc.getPages()[i].getSize();
                        const newPage = pdfDoc1.addPage([
                            width,
                            textY + 50
                        ]);
                        newPage.drawPage(americanFlag, {
                            y: textY + 50 - height
                        });
                    } else {
                        textX = textItem.transform[4];
                        textY = page.getViewport({
                            scale: 1
                        }).height - textItem.transform[5];
                        const americanFlag = await pdfDoc1.embedPage(pdfDoc.getPages()[i]);
                        const { width  } = pdfDoc.getPages()[i].getSize();
                        const newPage = pdfDoc1.addPage([
                            width,
                            textY
                        ]);
                        newPage.drawPage(americanFlag, {
                            y: textY - page.getViewport({
                                scale: 1
                            }).height
                        });
                    }
                }
            }
            if (count > 0) {
                const modifiedPdfBytes = await pdfDoc1.save();
                let bufferObj = Buffer.from(modifiedPdfBytes, "utf8");
                let base64String = bufferObj.toString("base64");
                let obj = {
                    fileName: ele,
                    pdfData: base64String
                };
                finalArayy.push(obj);
            }
        }
        return res.status(201).json({
            body: finalArayy
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (apiRoute);
const config = {
    api: {
        bodyParser: false
    }
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(837));
module.exports = __webpack_exports__;

})();