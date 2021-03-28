# easy-api

Write api interface with js decorators

```js
import { getInstance, Service, Post, Path, FieldMap } from 'easy-api';

@Service('users')
class User {
    @Post('/:id')
    queryData(@Path('id') _userId: string, @FieldMap() _data: any): Promise<any> {
        return {} as Promise<any>
    };
}
const userService = getInstance(User, {
    baseUrl: 'https://api.github.com/',
    adapter: (url, options) => {
        return fetch(url, {
            method: options.method,
            body: options.method === 'GET' ? null : JSON.stringify(options.params)
        });
    },
});
userService.queryData("w-rudolph", { x: '1', y: '2' }).then(console.log);
```
