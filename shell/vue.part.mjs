#!/usr/bin/env zx

const HOST = 'https://now.box.toys'
const BASE_URL = `${HOST}/templates/vue.part`

getProjectName()
.then(checkDirectoryExists)
.then(generateFiles)
.then(printSuccessMessage)
.catch(reason => echo(reason))

async function getProjectName() {
  const result = await question('Project name: ')

  if (!result.trim()) {
    throw new Error('Project name is required.')
  } else {
    return result
  }
}

async function checkDirectoryExists(projectName) {
  if (await exists(projectName)) {
    throw new Error(`Directory ${projectName} already exists.`)
  } else {
    return projectName
  }
}

async function generateFiles(projectName) {
  await mkdir(projectName)

  await spinner('Generating files...', async () => {
    await $`npm create vite@latest ${projectName} -- --template vue-ts`

    await within(async () => {
      await cd(projectName)

      await mkdir('.husky')
      await cp('.husky/pre-commit')
      await cp('.husky/commit-msg')

      await mkdir('.vscode')
      await cp('.vscode/profiles.code-profile')

      await cp('src/index.ts')
      await cp('src/button.vue')
      await cp('src/vite-env.d.ts')

      await mkdir('test')
      await cp('test/hello.test.ts')

      await cp('_gitignore')
      await $`mv _gitignore .gitignore`

      await cp('.browserslistrc')
      await cp('.commitlintrc')
      await cp('.cz-config.js')
      await cp('.czrc')
      await cp('.eslintrc.cjs')
      await cp('.lintstagedrc')
      await cp('.prettierrc')
      await cp('package.json')
      await cp('vite.config.ts')
      await cp('tsconfig.types.json')
      await cp('vitest.config.ts')

      await $`rm README.md`
      await $`rm index.html`
      await $`rm public/vite.svg`
      await $`rm .vscode/extensions.json`
      await $`rm src/App.vue`
      await $`rm src/main.ts`
      await $`rm src/style.css`
      await $`rm -rf src/assets`
      await $`rm -rf src/components`
      
      await $`git init`
    })
  })

  return projectName
}

async function printSuccessMessage(projectName) {
  echo``
  echo`Scaffolding project in ${await $`pwd`}${path.sep}${projectName}...`
  echo``
  echo`Done. Now run:`
  echo``
  echo`  cd ${projectName}`
  echo`  npm i`
  echo`  npm start`
  echo``
}

async function exists(dirName) {
  const pwd = await $`pwd`
  
  return fs.existsSync(path.join(pwd.stdout.replace('\n', ''), dirName))
}

async function mkdir(dirName) {
  await $`mkdir ${dirName}`.nothrow()
}

async function cp(fileName) {
  await $`touch ${fileName} && chmod +x ${fileName} && curl -s ${BASE_URL}/${fileName} > ${fileName}`
}