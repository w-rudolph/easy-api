import { RequestMethod, SERVICE_METHOD_KEY } from "./constants";
import { dependencies } from "./dependencies";
import { resolveClassDep } from "./decorators/class";
import { resolveFields, resolvePath } from "./decorators/parameter";
import { Class, ServiceOptions } from "./typing";

let defaultOptions: ServiceOptions<any> = {
  baseUrl: "",
  adapter: null,
};

export function setServiceOptions(options: ServiceOptions) {
  defaultOptions = options;
}

export function Result<T>() {
  return {} as T;
}

export function getInstance<T extends Class>(Cls: T, options?: ServiceOptions) {
  const [serviceName, serviceOptions = defaultOptions] = resolveClassDep(Cls);
  dependencies
    .filter((t) => t.type === SERVICE_METHOD_KEY && t.scope === Cls.name)
    .forEach((o) => {
      Cls.prototype[o.key] = (...args: any[]) => {
        const { adapter, baseUrl = "" } = options || (serviceOptions as ServiceOptions);
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
