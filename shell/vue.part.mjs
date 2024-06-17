#!/usr/bin/env zx

const HOST = 'https://now.box.toys'
const BASE_URL = `${HOST}/templates/vue.part`

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
    await $`npm create vite@latest ${projectName} -- --template vue-ts`

    await within(async () => {
      await cd(projectName)

      await mkdir('.husky')
      await cp('.husky/pre-commit')
      await cp('.husky/commit-msg')

      await mkdir('example')
      await cp('example/main.ts')

      await $`rm public/vite.svg`

      await cp('src/index.ts')
      await cp('src/button.vue')
      await cp('src/vite-env.d.ts')
      await $`rm src/App.vue`
      await $`rm src/main.ts`
      await $`rm src/style.css`
      await $`rm -rf src/assets`
      await $`rm -rf src/components`

      await mkdir('test')
      await cp('test/hello.test.ts')

      await cp('_gitignore')
      await cp('_npmignore')
      await cp('.browserslistrc')
      await cp('.commitlintrc')
      await cp('.cz-config.cjs')
      await cp('.eslintrc.cjs')
      await cp('.lintstagedrc')
      await cp('.prettierrc')
      await cp('index._html')
      await cp('tsconfig.types.json')
      await cp('vite.config.ts')
      await cp('vitest.config.ts')
      await cp('.npmrc')

      patchPackageJson({
        engines: {
          node: ">=18.0.0"
        },
        devDependencies: {
          "sass": "^1.68.0",
          "husky": "^8.0.3",
          "jsdom": "^22.1.0",
          "vitest": "^0.34.6",
          "eslint": "^8.50.0",
          "prettier": "^3.0.3",
          "commitizen": "^4.3.0",
          "lint-staged": "^14.0.1",
          "@types/node": "^20.8.2",
          "@vue/test-utils": "^2.4.1",
          "cz-customizable": "^7.0.0",
          "@commitlint/cli": "^17.7.1",
          "eslint-plugin-vue": "^9.17.0",
          "@vitest/coverage-v8": "^0.34.6",
          "@vitejs/plugin-vue-jsx": "^3.0.2",
          "@rushstack/eslint-patch": "^1.5.1",
          "@vue/eslint-config-prettier": "^8.0.0",
          "@vue/eslint-config-typescript": "^12.0.0",
          "@commitlint/config-conventional": "^17.7.0"
        },
        scripts: {
          "test": "vitest",
          "dev": "vite --host",
          "commit": "npx git-cz",
          "prepare": "husky install",
          "preview": "vite preview --host",
          "test:coverage": "vitest run --coverage",
          "build": "vite build && npm run build:types",
          "build:types": "vue-tsc --project tsconfig.types.json --declaration --emitDeclarationOnly --outDir types"
        }
      })

      await $`rm README.md`
      await $`mv _gitignore .gitignore`
      await $`mv _npmignore .npmignore`
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

  json.engines = Object.assign({}, json.engines, packages.engines)
  json.scripts = Object.assign({}, json.scripts, packages.scripts)
  json.dependencies = Object.assign({}, json.dependencies, packages.dependencies)
  json.devDependencies = Object.assign({}, json.devDependencies, packages.devDependencies)

  json.scripts.preview = undefined
  json.main = "./dist/index.cjs.js"
  json.types = "./types/index.d.ts"
  json.exports = {
    ".": {
      "import": {
        "types": "./types/index.d.ts",
        "default": "./dist/index.esm.mjs"
      },
      "require": {
        "types": "./types/index.d.ts",
        "default": "./dist/index.cjs.js"
      }
    }
  }

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
