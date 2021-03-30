import { SERVICE_CLASS_KEY } from "../constants";
import { dependencies } from "../dependencies";
import { Class, ServiceOptions } from "../typing";

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

