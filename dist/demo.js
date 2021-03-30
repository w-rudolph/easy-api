"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const class_1 = require("./decorators/class");
const method_1 = require("./decorators/method");
const parameter_1 = require("./decorators/parameter");
const serviceOptions = {
    baseUrl: "https://api.github.com/",
    adapter: (url, options) => {
        return fetch(url, {
            method: options.method,
            body: options.method === "GET" ? null : JSON.stringify(options.params),
        });
    },
};
let User = class User {
    queryData(_userId, _data) {
        return index_1.Result();
    }
};
__decorate([
    method_1.Post("/:id"),
    __param(0, parameter_1.Path("id")), __param(1, parameter_1.FieldMap()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], User.prototype, "queryData", null);
User = __decorate([
    class_1.Service("users")
], User);
index_1.setServiceOptions(serviceOptions);
const userService = index_1.getInstance(User);
userService.queryData("w-rudolph", { t: Date.now() }).then(console.log);
