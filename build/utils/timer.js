"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = void 0;
exports.wait = (t) => {
    return new Promise(resolve => setTimeout(resolve, t));
};
