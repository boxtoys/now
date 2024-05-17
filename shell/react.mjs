#!/usr/bin/env zx

const HOST = 'https://now.box.toys'
const BASE_URL = `${HOST}/templates/react`

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
    await $`npm create vite@latest ${projectName} -- --template react-swc-ts`

    await within(async () => {
      await cd(projectName)

      await mkdir('.husky')
      await cp('.husky/pre-commit')
      await cp('.husky/commit-msg')

      await mkdir('.vscode')
      await cp('.vscode/settings.json')
      await cp('.vscode/profiles.code-profile')

      await $`rm public/vite.svg`

      await mkdir('src/components')
      await cp('src/components/LoadingOrError.tsx')
      await cp('src/components/Title.tsx')
      await mkdir('src/pages')
      await cp('src/pages/Home.tsx')
      await mkdir('src/router')
      await cp('src/router/index.tsx')
      await cp('src/router/map.ts')
      await cp('src/App.tsx')
      await cp('src/main.css')
      await cp('src/main.tsx')
      
      await $`rm -rf src/App.css`
      await $`rm -rf src/assets`
      await $`rm -rf src/index.css`

      await cp('_gitignore')
      await cp('.commitlintrc')
      await cp('.cz-config.cjs')
      await cp('.lintstagedrc')
      await cp('.eslintrc.cjs')
      await cp('.prettierrc')
      await cp('index._html')
      await cp('postcss.config.cjs')
      await cp('tailwind.config.js')
      await cp('vite.config.ts')
      await cp('.npmrc')
      await cp('.nvmrc')

      patchPackageJson({
        engines: {
          node: ">=20.10.0"
        },
        dependencies: {
          "clsx": "^2.1.1",
          "localforage": "^1.10.0",
          "match-sorter": "^6.3.4",
          "react-router-dom": "^6.23.1",
          "sort-by": "^1.2.0"
        },
        devDependencies: {
          "@commitlint/cli": "^19.3.0",
          "@commitlint/config-conventional": "^19.2.2",
          "@types/node": "^20.12.12",
          "autoprefixer": "^10.4.19",
          "commitizen": "^4.3.0",
          "cz-customizable": "^7.0.0",
          "eslint-config-prettier": "^9.1.0",
          "husky": "^9.0.11",
          "lint-staged": "^15.2.2",
          "postcss": "^8.4.38",
          "prettier": "3.2.5",
          "prettier-plugin-tailwindcss": "^0.5.14",
          "sass": "^1.77.2",
          "tailwindcss": "^3.4.3",
          "vite-tsconfig-paths": "^4.3.2"
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

  json.engines = Object.assign({}, json.engines, packages.engines)
  json.scripts = Object.assign({}, json.scripts, packages.scripts)
  json.dependencies = Object.assign({}, json.dependencies, packages.dependencies)
  json.devDependencies = Object.assign({}, json.devDependencies, packages.devDependencies)

  delete json.scripts.lint

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

  fs.writeJsonSync('./tsconfig.json', json, { spaces: 2 })
}
