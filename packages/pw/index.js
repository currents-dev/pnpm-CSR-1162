#!/usr/bin/env node

const id = "@currents/pwc-scanner/discovery";
console.log(`Requiring "${id}" reporter in cwd: "${process.cwd()}"`);

console.log(
  require.resolve(id, {
    paths: [process.cwd()],
  })
);
