#!/usr/bin/env zx

const HOST = 'https://now.box.toys'
const BASE_URL = `${HOST}/templates/node.part`

await mkdir('.husky')
await cp('.husky/pre-commit')
await cp('.husky/commit-msg')

await mkdir('src')
await cp('src/index.ts')

await mkdir('test')
await cp('test/hello.test.ts')

await cp('.browserslistrc')
await cp('.commitlintrc')
await cp('.cz-config.js')
await cp('.czrc')
await cp('.eslintrc.js')
await cp('.gitignore')
await cp('.lintstagedrc')
await cp('.npmignore')
await cp('.prettierrc')
await cp('babel.config.json')
await cp('jest.config.json')
await cp('package.json')
await cp('rollup.config.js')
await cp('tsconfig.json')

await $`git init`

echo``
echo`Scaffolding project in ${await $`pwd`}...`
echo``
echo`Done. Now run:`
echo``
echo`  npm i`
echo`  npm run dev`
echo``

async function mkdir(dirName) {
  await $`mkdir ${dirName}`.nothrow()
}

async function cp(fileName) {
  await $`touch ${fileName} && chmod +x ${fileName} && curl -s ${BASE_URL}/${fileName} > ${fileName}`
}
