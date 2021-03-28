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
const SERVICE_METHOD_KEY = 'service:method';
function Service(name) {
    return (target) => {
        dependencies
            .filter(t => t.type === SERVICE_METHOD_KEY && t.scope === target.name)
            .forEach(o => {
            target.prototype[o.key] = (...args) => {
                const length = args.length;
                const { adapter, baseUrl = '' } = target.prototype._httpAdapterOption;
                return adapter && adapter(`${baseUrl}${name}${o.value}`, {
                    params: length === 0 ? undefined : length === 1 ? args[0] : args,
                    method: o.options.method || RequestMethod.GET,
                });
            };
        });
    };
}
exports.Service = Service;
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
exports.createMethodDecorator = createMethodDecorator;
exports.Post = createMethodDecorator(RequestMethod.POST);
exports.Put = createMethodDecorator(RequestMethod.PUT);
exports.Get = createMethodDecorator(RequestMethod.GET);
exports.Delete = createMethodDecorator(RequestMethod.DELETE);
exports.Patch = createMethodDecorator(RequestMethod.PATCH);
exports.Options = createMethodDecorator(RequestMethod.OPTIONS);
exports.Head = createMethodDecorator(RequestMethod.HEAD);
exports.All = createMethodDecorator(RequestMethod.ALL);
function getInstance(cls, options) {
    cls.prototype._httpAdapterOption = options;
    return cls.prototype;
}
exports.getInstance = getInstance;
