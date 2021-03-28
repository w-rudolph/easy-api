interface Class {
    new(...args: any[]): void;
}

type AdapterOptions = {
    method: RequestMethod;
    params: any;
}

type HttpAdapter<T> = (url: string, options: AdapterOptions) => Promise<T>;

enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
    ALL = 'ALL',
}

type InstanceOptions<T = any> = {
    adapter: HttpAdapter<T>,
    baseUrl?: string,
}

type DependencyItem = {
    scope: string;
    key: string;
    value: any;
    type: string;
    options?: any;
}

const dependencies: DependencyItem[] = [];
const SERVICE_METHOD_KEY = 'service:method';

export function Service(name: string) {
    return (target: Class) => {
        dependencies
            .filter(t => t.type === SERVICE_METHOD_KEY && t.scope === target.name)
            .forEach(o => {
                target.prototype[o.key] = (...args: any[]) => {
                    const length = args.length;
                    const { adapter, baseUrl = '' } = target.prototype._httpAdapterOption as InstanceOptions;
                    return adapter && adapter(`${baseUrl}${name}${o.value}`, {
                        params: length === 0 ? undefined : length === 1 ? args[0] : args,
                        method: o.options.method || RequestMethod.GET,
                    });
                };
            });
    }
}

export function createMethodDecorator(method: RequestMethod) {
    return (path: string) => {
        return (target: any, key: string) => {
            dependencies.push({
                scope: target.constructor.name,
                key,
                value: path,
                type: SERVICE_METHOD_KEY,
                options: { method },
            });
        };
    }
}

export const Post = createMethodDecorator(RequestMethod.POST);
export const Put = createMethodDecorator(RequestMethod.PUT);
export const Get = createMethodDecorator(RequestMethod.GET);
export const Delete = createMethodDecorator(RequestMethod.DELETE);
export const Patch = createMethodDecorator(RequestMethod.PATCH);
export const Options = createMethodDecorator(RequestMethod.OPTIONS);
export const Head = createMethodDecorator(RequestMethod.HEAD);
export const All = createMethodDecorator(RequestMethod.ALL);

export function getInstance<T extends Class>(cls: T, options: InstanceOptions) {
    cls.prototype._httpAdapterOption = options;
    return cls.prototype as InstanceType<T>;
}
