Following the error message:

```plain
Error: Cannot find module '@currents/pwc-scanner/discovery'\n" +
....
at resolveReporter (/Users/carlbell/dev/thryve/vscode/gloo-app/node_modules/.pnpm/playwright@1.43.1/node_modules/playwright/lib/program.js:316:18)
....
```

and the source code at: https://github.com/microsoft/playwright/blob/6c827121bf3f7a0c9492822000861f322840b583/packages/playwright/src/program.ts#L330

```ts
function resolveReporter(id: string) {
  if (builtInReporters.includes(id as any)) return id;

  const localPath = path.resolve(process.cwd(), id);

  if (fs.existsSync(localPath)) return localPath;

  return require.resolve(id, { paths: [process.cwd()] }); // 👈🏻 process.cwd()
}
```

According to [NodeJS documentation](https://nodejs.org/api/modules.html#requireresolverequest-options), when you specify the path, it starts the module discovery from `process.cwd()` - which is, according to user-shared logs is `/Users/carlbell/dev/thryve/vscode/gloo-app/apps/frontend`

It seems like the package is just simply not installed anywhere in `node_modules` directory. I tried reproducing it by renaming `@currents/pwc-scanner` in `node_modules/.pnpm` but got stuck - I can't get how nodejs is able to resolve the modules from `node_modules/.pnpm` (see below).

```sh
pnpm i
cd packages/pw
```

Modify the file `node_modules/.pnpm/playwright@1.43.1/node_modules/playwright/lib/program.js`

```ts
function resolveReporter(id) {
  if (_config.builtInReporters.includes(id)) return id;
  const localPath = _path.default.resolve(process.cwd(), id);

  console.log(`Looking for reporter "${id}" in "${localPath}"`);
  if (_fs.default.existsSync(localPath)) return localPath;

  console.log(`Requiring "${id}" reporter in cwd: "${process.cwd()}"`);

  const m = require.resolve(id, {
    paths: [process.cwd()],
  });

  console.log("Resolved reporter: ", m);
  return m;
}
```

For some reason this works (I don't know how exactly pnpm is able to resolve the module):

```sh
cd packages/pw
pnpm test

# ...
# Requiring "@currents/pwc-scanner/discovery" reporter in cwd: "/Users/agoldis/currents-playwright-pnpm/packages/pw"
# Resolved reporter: /Users/agoldis/currents-playwright-pnpm/node_modules/.pnpm/@currents+pwc-scanner@0.1.1/node_modules/@currents/pwc-scanner/dist/discovery/index.js'
```

...and this doesn't work:

```sh
cd packages/pw
pnpm test-require
```
