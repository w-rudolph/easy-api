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
export declare type ServiceOptions<T = any> = {
    adapter: HttpAdapter<T> | null;
    baseUrl?: string;
};
export declare function setServiceOptions(options: ServiceOptions): void;
export declare function Service(name: string, options?: ServiceOptions): (target: Class) => void;
export declare const Post: (path: string) => (target: any, key: string) => void;
export declare const Put: (path: string) => (target: any, key: string) => void;
export declare const Get: (path: string) => (target: any, key: string) => void;
export declare const Delete: (path: string) => (target: any, key: string) => void;
export declare const Patch: (path: string) => (target: any, key: string) => void;
export declare const Options: (path: string) => (target: any, key: string) => void;
export declare const Head: (path: string) => (target: any, key: string) => void;
export declare const All: (path: string) => (target: any, key: string) => void;
export declare function getInstance<T extends Class>(cls: T, options?: ServiceOptions): InstanceType<T>;
export declare const Path: (path: string) => (target: any, key: string, paramIndex: number) => void;
export declare const Field: (path: string) => (target: any, key: string, paramIndex: number) => void;
export declare const FieldMap: () => (target: any, key: string, paramIndex: number) => void;
export declare function Result<T>(): T;
export {};
