interface Class {
  new(...args: any[]): void;
}

type AdapterOptions = {
  method: RequestMethod;
  params: any;
};

type HttpAdapter<T> = (url: string, options: AdapterOptions) => Promise<T>;

enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  ALL = "ALL",
}

export type ServiceOptions<T = any> = {
  adapter: HttpAdapter<T> | null;
  baseUrl?: string;
};

type DependencyItem = {
  scope: string;
  key: string;
  value: any;
  type: string;
  options?: any;
};

const dependencies: DependencyItem[] = [];
const SERVICE_CLASS_KEY = "service:class";
const SERVICE_METHOD_KEY = "service:method";
const SERVICE_REQUEST_PATH = "service:request:path";
const SERVICE_REQUEST_FIELD = "service:request:field";
const SERVICE_REQUEST_FIELD_MAP = "service:request:fieldMap";

let defaultOptions: ServiceOptions<any> = {
  baseUrl: "",
  adapter: null,
};

export function setServiceOptions(options: ServiceOptions) {
  defaultOptions = options;
}

export function Service(name: string, options?: ServiceOptions) {
  return (target: Class) => {
    dependencies.push({
      scope: target.name,
      key: '',
      value: name,
      options,
      type: SERVICE_CLASS_KEY,
    });
  };
}

export function resolveClassDep(Cls: Class) {
  const fd = dependencies.find(t => t.type === SERVICE_CLASS_KEY && t.scope === Cls.name);
  return fd ? [fd.value, fd.options] : [Cls.name];
}

function resolveFields(o: DependencyItem, args: any[]) {
  let result = {} as any;
  dependencies
    .filter(
      (t) =>
        (t.type === SERVICE_REQUEST_FIELD ||
          t.type === SERVICE_REQUEST_FIELD_MAP) &&
        t.key === o.key &&
        t.scope === o.scope
    )
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

function resolvePath(url: string, o: DependencyItem, args: any[]) {
  let filterUrl = url;
  dependencies
    .filter(
      (t) =>
        t.type === SERVICE_REQUEST_PATH &&
        t.key === o.key &&
        t.scope === o.scope
    )
    .forEach((t) => {
      const [path, index] = t.value;
      filterUrl = filterUrl.replace(new RegExp(`:${path}`, "g"), args[index]);
    });
  return filterUrl;
}

function resolveMethods(Cls: Class) {
  return dependencies
    .filter((t) => t.type === SERVICE_METHOD_KEY && t.scope === Cls.name);
}

function createMethodDecorator(method: RequestMethod) {
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
  };
}

export const Post = createMethodDecorator(RequestMethod.POST);
export const Put = createMethodDecorator(RequestMethod.PUT);
export const Get = createMethodDecorator(RequestMethod.GET);
export const Delete = createMethodDecorator(RequestMethod.DELETE);
export const Patch = createMethodDecorator(RequestMethod.PATCH);
export const Options = createMethodDecorator(RequestMethod.OPTIONS);
export const Head = createMethodDecorator(RequestMethod.HEAD);
export const All = createMethodDecorator(RequestMethod.ALL);


function Parameter(type: string, path?: string) {
  return (target: any, key: string, paramIndex: number) => {
    dependencies.push({
      scope: target.constructor.name,
      key,
      value: [path, paramIndex],
      type: type,
    });
  };
}

export const Path = (path: string) => Parameter(SERVICE_REQUEST_PATH, path);
export const Field = (path: string) => Parameter(SERVICE_REQUEST_FIELD, path);
export const FieldMap = () => Parameter(SERVICE_REQUEST_FIELD_MAP);

export function getInstance<T extends Class>(Cls: T, options?: ServiceOptions) {
  const [serviceName, serviceOptions = defaultOptions] = resolveClassDep(Cls);
  resolveMethods(Cls)
    .forEach((o) => {
      Cls.prototype[o.key] = (...args: any[]) => {
        const { adapter, baseUrl = "" } = options || serviceOptions;
        const url = `${baseUrl}${serviceName}${o.value}`;
        return (
          adapter &&
          adapter(resolvePath(url, o, args), {
            params: resolveFields(o, args),
            method: o.options.method || RequestMethod.GET,
          })
        );
      };
    });
  return Cls.prototype as InstanceType<T>;
}

export function Result<T>() {
  return {} as T;
}
