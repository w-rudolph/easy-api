interface Class {
    new (...args: any[]): void;
}
declare type AdapterOptions = {
    method: RequestMethod;
    params: any;
};
declare type HttpAdapter<T> = (url: string, options: AdapterOptions) => Promise<T>;
declare enum RequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
    ALL = "ALL"
}
declare type InstanceOptions<T = any> = {
    adapter: HttpAdapter<T>;
    baseUrl?: string;
};
export declare function Service(name: string): (target: Class) => void;
export declare function createMethodDecorator(method: RequestMethod): (path: string) => (target: any, key: string) => void;
export declare const Post: (path: string) => (target: any, key: string) => void;
export declare const Put: (path: string) => (target: any, key: string) => void;
export declare const Get: (path: string) => (target: any, key: string) => void;
export declare const Delete: (path: string) => (target: any, key: string) => void;
export declare const Patch: (path: string) => (target: any, key: string) => void;
export declare const Options: (path: string) => (target: any, key: string) => void;
export declare const Head: (path: string) => (target: any, key: string) => void;
export declare const All: (path: string) => (target: any, key: string) => void;
export declare function getInstance<T extends Class>(cls: T, options: InstanceOptions): InstanceType<T>;
export {};
