#!/usr/bin/env zx

const HOST = 'https://now.box.toys'
const BASE_URL = `${HOST}/templates/nest`

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
    await $`npx -y @nestjs/cli new ${projectName} --skip-install --skip-git --strict --package-manager npm`

    await within(async () => {
      await cd(projectName)

      await mkdir('.husky')
      await cp('.husky/pre-commit')
      await cp('.husky/commit-msg')

      await mkdir('.vscode')
      await cp('.vscode/profiles.code-profile')

      await cp('src/app.controller.spec.ts')
      await cp('src/app.controller.ts')
      await cp('src/app.module.ts')
      await cp('src/app.service.ts')
      await cp('src/main.ts')

      await cp('test/app.e2e-spec.ts')
      await cp('test/jest-e2e.json')

      await cp('_gitignore')
      await cp('.commitlintrc')
      await cp('.cz-config.cjs')
      await cp('.eslintrc.cjs')
      await cp('.lintstagedrc')
      await cp('.prettierrc')
      await cp('tsconfig.json')

      mergePackageJson({
        devDependencies: {
          "husky": "^8.0.3",
          "prettier": "^3.0.3",
          "commitizen": "^4.3.0",
          "lint-staged": "^14.0.1",
          "cz-customizable": "^7.0.0",
          "@commitlint/cli": "^17.7.1",
          "@commitlint/config-conventional": "^17.7.0",
        },
        scripts: {
          "commit": "npx git-cz",
          "prepare": "husky install"
        }
      })

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
  echo`  npm start`
  echo``
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

function mergePackageJson(packages) {
  const json = fs.readJsonSync('./package.json')

  json.type = 'module'
  
  json.jest.moduleNameMapper = { "^(\\.{1,2}/.*)\\.js$": "$1" }
  json.jest.transform["^.+\\.(t|j)s$"] = ["ts-jest", { "useESM": true }]

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
