"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImageFiles = exports.downloadFile = void 0;
const tmp_promise_1 = require("tmp-promise");
const config_1 = require("./config");
function downloadFile(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const { path, cleanup } = yield tmp_promise_1.file({ postfix: '.jpg' });
        yield config_1.storage.bucket().file(fileName).download({ destination: path });
        return path;
    });
}
exports.downloadFile = downloadFile;
exports.generateImageFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        prefix: `test-images/`,
    };
    // Lists files in the bucket
    const [files] = yield config_1.storage.bucket().getFiles(options);
    let filePaths = [];
    for (const fileObj of files) {
        const path = yield downloadFile(fileObj.name).catch(console.error);
        filePaths.push(path);
    }
    return filePaths;
});
//# sourceMappingURL=helpers.js.map