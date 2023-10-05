#!/usr/bin/env zx

const HOST = 'http://localhost:3000'
const BASE_URL = `${HOST}/templates/vue`

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

      await cp('.browserslistrc')
      await cp('.commitlintrc')
      await cp('.cz-config.js')
      await cp('.eslintrc.cjs')
      await cp('.czrc')
      await cp('_gitignore')
      await cp('.lintstagedrc')
      await cp('.prettierrc')
      await cp('.env.development')
      await cp('.env.production')
      await cp('vite.config.ts')
      await cp('package.json')
      await cp('index._html')

      await mkdir('src/pages')
      await mkdir('src/router')
      await cp('src/main.ts')
      await cp('src/App.vue')
      await cp('src/pages/home.vue')
      await cp('src/router/index.ts')
      await cp('src/vite-env.d.ts')

      await $`rm README.md`
      await $`rm public/vite.svg`
      await $`rm src/style.css`
      await $`rm -rf src/assets`
      await $`rm -rf src/components`
      await $`mv _gitignore .gitignore`
      await $`mv index._html index.html`
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
