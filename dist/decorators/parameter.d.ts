import { DependencyItem } from '../typing';
export declare function resolveFields(o: DependencyItem, args: any[]): any;
export declare function resolvePath(url: string, o: DependencyItem, args: any[]): string;
export declare const Path: (path: string) => (target: any, key: string, paramIndex: number) => void;
export declare const Field: (path: string) => (target: any, key: string, paramIndex: number) => void;
export declare const FieldMap: () => (target: any, key: string, paramIndex: number) => void;
