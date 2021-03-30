import { RequestMethod } from "./constants";

interface Class {
  new(...args: any[]): void;
}

type AdapterOptions = {
  method: RequestMethod;
  params: any;
};

type HttpAdapter<T> = (url: string, options: AdapterOptions) => Promise<T>;

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
