#!/usr/bin/env zx

const HOST = 'https://now.box.toys'
const BASE_URL = `${HOST}/templates/nuxt`

getProjectName()
.then(checkDirectoryExists)
.then(generateFiles)
.then(printSuccessMessage)
.catch(reason => echo(reason))

async function getProjectName() {
  const projectName = normalize(argv.projectName)

  if (projectName) {
    return projectName.toLowerCase()
  }
  
  const result = await question('Project name: ')

  if (!result.trim()) {
    throw new Error('Project name is required.')
  } else {
    return result.toLowerCase()
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
    await $`npx -y nuxi@latest init ${projectName} --no-install --no-gitInit --packageManager npm`

    await within(async () => {
      await cd(projectName)

      await mkdir('.husky')
      await cp('.husky/pre-commit')
      await cp('.husky/commit-msg')

      await mkdir('.vscode')
      await cp('.vscode/profiles.code-profile')

      await mkdir('assets/css')
      await cp('assets/css/reset.css')

      await mkdir('components')
      await cp('components/HelloWorld.vue')

      await mkdir('locales')
      await cp('locales/en.json')
      await cp('locales/fr.json')

      await mkdir('pages')
      await cp('pages/index.vue')

      await cp('_gitignore')
      await cp('.commitlintrc')
      await cp('.cz-config.cjs')
      await cp('.env.development')
      await cp('.env.production')
      await cp('.eslintrc.cjs')
      await cp('.lintstagedrc')
      await cp('.prettierrc')
      await cp('i18n.config.ts')
      await cp('nuxt.config.ts')

      patchPackageJson({
        devDependencies: {
          "sass": "^1.68.0",
          "husky": "^8.0.3",
          "eslint": "^8.50.0",
          "prettier": "^3.0.3",
          "commitizen": "^4.3.0",
          "lint-staged": "^14.0.1",
          "@types/node": "^20.8.2",
          "cz-customizable": "^7.0.0",
          "@commitlint/cli": "^17.7.1",
          "@nuxtjs/i18n": "^8.0.0-rc.5",
          "@nuxtjs/eslint-module": "^4.1.0",
          "@commitlint/config-conventional": "^17.7.0",
          "@nuxtjs/eslint-config-typescript": "^12.1.0"
        },
        scripts: {
          "commit": "npx git-cz",
          "prepare": "husky install",
          "build": "nuxt build --dotenv .env.production",
          "generate": "nuxt generate --dotenv .env.production",
          "dev": "nuxt dev --host --no-qr --dotenv .env.development"
        }
      })
      
      await $`rm app.vue`
      await $`rm README.md`
      await $`mv _gitignore .gitignore`
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
  echo`  npm run dev`
  echo``
}

async function exists(dirName) {
  const pwd = await $`pwd`
  
  return fs.existsSync(path.join(pwd.stdout.replace('\n', ''), dirName))
}

function normalize(projectName) {
  return projectName ? projectName.toString().trim().replace('/bin/bash', '') : ''
}

async function mkdir(dirName) {
  await $`mkdir -p ${dirName}`.nothrow()
}

async function cp(fileName) {
  await $`touch ${fileName} && chmod +x ${fileName} && curl -s ${BASE_URL}/${fileName} > ${fileName}`
}

function patchPackageJson(packages) {
  const json = fs.readJsonSync('./package.json')

  json.scripts = Object.assign({}, json.scripts, packages.scripts)
  json.devDependencies = Object.assign({}, json.devDependencies, packages.devDependencies)

  json.config = {
    "commitizen": {
      "path": "./node_modules/cz-customizable"
    },
    "cz-customizable": {
      "config": "./.cz-config.cjs"
    }
  }

  fs.writeJsonSync('./package.json', json, { spaces: 2 })
}
