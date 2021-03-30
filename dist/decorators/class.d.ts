import { Class, ServiceOptions } from "../typing";
export declare function Service(name: string, options?: ServiceOptions): (target: Class) => void;
export declare function resolveClassDep(Cls: Class): any[];
