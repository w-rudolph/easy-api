import { SERVICE_REQUEST_FIELD, SERVICE_REQUEST_FIELD_MAP, SERVICE_REQUEST_PATH } from '../constants';
import { dependencies } from '../dependencies'
import { DependencyItem } from '../typing';

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

export function resolveFields(o: DependencyItem, args: any[]) {
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

export function resolvePath(url: string, o: DependencyItem, args: any[]) {
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

export const Path = (path: string) => Parameter(SERVICE_REQUEST_PATH, path);
export const Field = (path: string) => Parameter(SERVICE_REQUEST_FIELD, path);
export const FieldMap = () => Parameter(SERVICE_REQUEST_FIELD_MAP);

