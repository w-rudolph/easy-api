import { Class, ServiceOptions } from "./typing";
export declare function setServiceOptions(options: ServiceOptions): void;
export declare function Result<T>(): T;
export declare function getInstance<T extends Class>(Cls: T, options?: ServiceOptions): InstanceType<T>;
