#!/usr/bin/env zx

const HOST = 'https://now.box.toys'
const BASE_URL = `${HOST}/templates/vue`

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

      await mkdir('.vscode')
      await $`rm .vscode/extensions.json`
      await cp('.vscode/profiles.code-profile')

      await $`rm public/vite.svg`

      await mkdir('src/pages')
      await cp('src/pages/home.vue')
      await mkdir('src/router')
      await cp('src/router/index.ts')
      await cp('src/App.vue')
      await cp('src/main.ts')
      await cp('src/vite-env.d.ts')
      await $`rm src/style.css`
      await $`rm -rf src/assets`
      await $`rm -rf src/components`

      await cp('_gitignore')
      await cp('.browserslistrc')
      await cp('.commitlintrc')
      await cp('.cz-config.cjs')
      await cp('.env.development')
      await cp('.env.production')
      await cp('.eslintrc.cjs')
      await cp('.lintstagedrc')
      await cp('.prettierrc')
      await cp('index._html')
      await cp('vite.config.ts')
      await cp('.npmrc')

      patchPackageJson({
        engines: {
          node: ">=18.0.0"
        },
        dependencies: {
          "vue-router": "^4.2.5"
        },
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
          "eslint-plugin-vue": "^9.17.0",
          "@vitejs/plugin-vue-jsx": "^3.0.2",
          "@rushstack/eslint-patch": "^1.5.1",
          "vite-plugin-vue-devtools": "^7.0.16",
          "@vue/eslint-config-prettier": "^8.0.0",
          "@vue/eslint-config-typescript": "^12.0.0",
          "@commitlint/config-conventional": "^17.7.0"
        },
        scripts: {
          "dev": "vite --host",
          "commit": "npx git-cz",
          "prepare": "husky install",
          "preview": "vite preview --host"
        }
      })

      patchTsConfigJSON()
      
      await $`rm README.md`
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
  echo`  npm run dev`
  echo``
}

function normalize(projectName) {
  return projectName ? projectName.toString().trim().replace('/bin/bash', '') : ''
}

async function exists(dirName) {
  const pwd = await $`pwd`
  
  return fs.existsSync(path.join(pwd.stdout.replace('\n', ''), dirName))
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
  json.dependencies = Object.assign({}, json.dependencies, packages.dependencies)
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

function patchTsConfigJSON() {
  let json = fs.readFileSync('./tsconfig.json', 'utf-8')
  json = JSON.parse(json.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''))

  json.compilerOptions = Object.assign({}, json.compilerOptions, {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  })
  json.include = ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]

  fs.writeJsonSync('./tsconfig.json', json, { spaces: 2 })
}
