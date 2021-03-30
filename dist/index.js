"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const dependencies_1 = require("./dependencies");
const class_1 = require("./decorators/class");
const parameter_1 = require("./decorators/parameter");
let defaultOptions = {
    baseUrl: "",
    adapter: null,
};
function setServiceOptions(options) {
    defaultOptions = options;
}
exports.setServiceOptions = setServiceOptions;
function Result() {
    return {};
}
exports.Result = Result;
function getInstance(Cls, options) {
    const [serviceName, serviceOptions = defaultOptions] = class_1.resolveClassDep(Cls);
    dependencies_1.dependencies
        .filter((t) => t.type === constants_1.SERVICE_METHOD_KEY && t.scope === Cls.name)
        .forEach((o) => {
        Cls.prototype[o.key] = (...args) => {
            const { adapter, baseUrl = "" } = options || serviceOptions;
            const url = `${baseUrl}${serviceName}${o.value}`;
            return (adapter &&
                adapter(parameter_1.resolvePath(url, o, args), {
                    params: parameter_1.resolveFields(o, args),
                    method: o.options.method || constants_1.RequestMethod.GET,
                }));
        };
    });
    return Cls.prototype;
}
exports.getInstance = getInstance;
