"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["GET"] = "GET";
    RequestMethod["POST"] = "POST";
    RequestMethod["PUT"] = "PUT";
    RequestMethod["DELETE"] = "DELETE";
    RequestMethod["PATCH"] = "PATCH";
    RequestMethod["HEAD"] = "HEAD";
    RequestMethod["OPTIONS"] = "OPTIONS";
    RequestMethod["ALL"] = "ALL";
})(RequestMethod || (RequestMethod = {}));
const dependencies = [];
const SERVICE_METHOD_KEY = "service:method";
const SERVICE_REQUEST_PATH = "service:request:path";
const SERVICE_REQUEST_FIELD = "service:request:field";
const SERVICE_REQUEST_FIELD_MAP = "service:request:fieldMap";
let defaultOptions = {
    baseUrl: "",
    adapter: null,
};
function setServiceOptions(options) {
    defaultOptions = options;
}
exports.setServiceOptions = setServiceOptions;
function Service(name, options) {
    return (target) => {
        dependencies
            .filter((t) => t.type === SERVICE_METHOD_KEY && t.scope === target.name)
            .forEach((o) => {
            target.prototype[o.key] = (...args) => {
                const { adapter, baseUrl = "" } = target.prototype._serviceOptions ||
                    options ||
                    defaultOptions;
                const url = `${baseUrl}${name}${o.value}`;
                return (adapter &&
                    adapter(resolvePath(url, o, args), {
                        params: resolveFields(o, args),
                        method: o.options.method || RequestMethod.GET,
                    }));
            };
        });
    };
}
exports.Service = Service;
function resolveFields(o, args) {
    let result = {};
    dependencies
        .filter((t) => (t.type === SERVICE_REQUEST_FIELD ||
        t.type === SERVICE_REQUEST_FIELD_MAP) &&
        t.key === o.key &&
        t.scope === o.scope)
        .forEach((t) => {
        const [fieldKey, index] = t.value;
        if (t.type === SERVICE_REQUEST_FIELD) {
            result[fieldKey] = args[index];
        }
        if (t.type === SERVICE_REQUEST_FIELD_MAP) {
            const mapData = args[index];
            Object.keys(mapData).forEach((k) => {
                result[k] = mapData[k];
            });
        }
    });
    return result;
}
function resolvePath(url, o, args) {
    let filterUrl = url;
    dependencies
        .filter((t) => t.type === SERVICE_REQUEST_PATH &&
        t.key === o.key &&
        t.scope === o.scope)
        .forEach((t) => {
        const [path, index] = t.value;
        filterUrl = filterUrl.replace(new RegExp(`:${path}`, "g"), args[index]);
    });
    return filterUrl;
}
function createMethodDecorator(method) {
    return (path) => {
        return (target, key) => {
            dependencies.push({
                scope: target.constructor.name,
                key,
                value: path,
                type: SERVICE_METHOD_KEY,
                options: { method },
            });
        };
    };
}
exports.Post = createMethodDecorator(RequestMethod.POST);
exports.Put = createMethodDecorator(RequestMethod.PUT);
exports.Get = createMethodDecorator(RequestMethod.GET);
exports.Delete = createMethodDecorator(RequestMethod.DELETE);
exports.Patch = createMethodDecorator(RequestMethod.PATCH);
exports.Options = createMethodDecorator(RequestMethod.OPTIONS);
exports.Head = createMethodDecorator(RequestMethod.HEAD);
exports.All = createMethodDecorator(RequestMethod.ALL);
function getInstance(cls, options) {
    options && (cls.prototype._serviceOptions = options);
    return cls.prototype;
}
exports.getInstance = getInstance;
function Parameter(type, path) {
    return (target, key, paramIndex) => {
        dependencies.push({
            scope: target.constructor.name,
            key,
            value: [path, paramIndex],
            type: type,
        });
    };
}
exports.Path = (path) => Parameter(SERVICE_REQUEST_PATH, path);
exports.Field = (path) => Parameter(SERVICE_REQUEST_FIELD, path);
exports.FieldMap = () => Parameter(SERVICE_REQUEST_FIELD_MAP);
function Result() {
    return {};
}
exports.Result = Result;
