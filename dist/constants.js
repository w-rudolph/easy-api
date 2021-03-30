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
})(RequestMethod = exports.RequestMethod || (exports.RequestMethod = {}));
exports.SERVICE_CLASS_KEY = "service:class";
exports.SERVICE_METHOD_KEY = "service:method";
exports.SERVICE_REQUEST_PATH = "service:request:path";
exports.SERVICE_REQUEST_FIELD = "service:request:field";
exports.SERVICE_REQUEST_FIELD_MAP = "service:request:fieldMap";
