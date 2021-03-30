import { RequestMethod, SERVICE_METHOD_KEY } from "../constants";
import { dependencies } from "../dependencies";

export const Post = createMethodDecorator(RequestMethod.POST);
export const Put = createMethodDecorator(RequestMethod.PUT);
export const Get = createMethodDecorator(RequestMethod.GET);
export const Delete = createMethodDecorator(RequestMethod.DELETE);
export const Patch = createMethodDecorator(RequestMethod.PATCH);
export const Options = createMethodDecorator(RequestMethod.OPTIONS);
export const Head = createMethodDecorator(RequestMethod.HEAD);
export const All = createMethodDecorator(RequestMethod.ALL);

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

