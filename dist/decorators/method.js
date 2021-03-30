"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const dependencies_1 = require("../dependencies");
exports.Post = createMethodDecorator(constants_1.RequestMethod.POST);
exports.Put = createMethodDecorator(constants_1.RequestMethod.PUT);
exports.Get = createMethodDecorator(constants_1.RequestMethod.GET);
exports.Delete = createMethodDecorator(constants_1.RequestMethod.DELETE);
exports.Patch = createMethodDecorator(constants_1.RequestMethod.PATCH);
exports.Options = createMethodDecorator(constants_1.RequestMethod.OPTIONS);
exports.Head = createMethodDecorator(constants_1.RequestMethod.HEAD);
exports.All = createMethodDecorator(constants_1.RequestMethod.ALL);
function createMethodDecorator(method) {
    return (path) => {
        return (target, key) => {
            dependencies_1.dependencies.push({
                scope: target.constructor.name,
                key,
                value: path,
                type: constants_1.SERVICE_METHOD_KEY,
                options: { method },
            });
        };
    };
}
