"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const dependencies_1 = require("../dependencies");
function Parameter(type, path) {
    return (target, key, paramIndex) => {
        dependencies_1.dependencies.push({
            scope: target.constructor.name,
            key,
            value: [path, paramIndex],
            type: type,
        });
    };
}
function resolveFields(o, args) {
    let result = {};
    dependencies_1.dependencies
        .filter((t) => (t.type === constants_1.SERVICE_REQUEST_FIELD ||
        t.type === constants_1.SERVICE_REQUEST_FIELD_MAP) &&
        t.key === o.key &&
        t.scope === o.scope)
        .forEach((t) => {
        const [fieldKey, index] = t.value;
        if (t.type === constants_1.SERVICE_REQUEST_FIELD) {
            result[fieldKey] = args[index];
        }
        if (t.type === constants_1.SERVICE_REQUEST_FIELD_MAP) {
            const mapData = args[index];
            Object.keys(mapData).forEach((k) => {
                result[k] = mapData[k];
            });
        }
    });
    return result;
}
exports.resolveFields = resolveFields;
function resolvePath(url, o, args) {
    let filterUrl = url;
    dependencies_1.dependencies
        .filter((t) => t.type === constants_1.SERVICE_REQUEST_PATH &&
        t.key === o.key &&
        t.scope === o.scope)
        .forEach((t) => {
        const [path, index] = t.value;
        filterUrl = filterUrl.replace(new RegExp(`:${path}`, "g"), args[index]);
    });
    return filterUrl;
}
exports.resolvePath = resolvePath;
exports.Path = (path) => Parameter(constants_1.SERVICE_REQUEST_PATH, path);
exports.Field = (path) => Parameter(constants_1.SERVICE_REQUEST_FIELD, path);
exports.FieldMap = () => Parameter(constants_1.SERVICE_REQUEST_FIELD_MAP);
