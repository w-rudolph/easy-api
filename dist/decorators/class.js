"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const dependencies_1 = require("../dependencies");
function Service(name, options) {
    return (target) => {
        dependencies_1.dependencies.push({
            scope: target.name,
            key: '',
            value: name,
            options,
            type: constants_1.SERVICE_CLASS_KEY,
        });
    };
}
exports.Service = Service;
function resolveClassDep(Cls) {
    const fd = dependencies_1.dependencies.find(t => t.type === constants_1.SERVICE_CLASS_KEY && t.scope === Cls.name);
    return fd ? [fd.value, fd.options] : [Cls.name];
}
exports.resolveClassDep = resolveClassDep;
