import {
  getInstance,
  Service,
  Post,
  Path,
  FieldMap,
  Result,
  setServiceOptions,
  ServiceOptions,
} from ".";

const serviceOptions: ServiceOptions = {
  baseUrl: "https://api.github.com/",
  adapter: (url, options) => {
    return fetch(url, {
      method: options.method,
      body: options.method === "GET" ? null : JSON.stringify(options.params),
    });
  },
};

@Service("users", /**serviceOptions*/)
class User {
  @Post("/:id")
  queryData(@Path("id") _userId: string, @FieldMap() _data: any) {
    return Result<Promise<any>>();
  }
}
setServiceOptions(serviceOptions);
const userService = getInstance(User, /**serviceOptions*/);
userService.queryData("w-rudolph", { t: Date.now() }).then(console.log);
