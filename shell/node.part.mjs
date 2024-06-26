#!/usr/bin/env zx

const HOST = 'https://now.box.toys'
const BASE_URL = `${HOST}/templates/node.part`

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

  await within(async () => {
    await cd(projectName)

    await spinner('Generated files...', async () => {
      await mkdir('.husky')
      await cp('.husky/pre-commit')
      await cp('.husky/commit-msg')

      await mkdir('src')
      await cp('src/index.ts')

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
      await cp('babel.config.json')
      await cp('jest.config.json')
      await cp('package.json')
      await cp('rollup.config.mjs')
      await cp('tsconfig.json')

      await $`mv _gitignore .gitignore`
      await $`mv _npmignore .npmignore`
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

function normalize(projectName) {
  return projectName ? projectName.toString().trim().replace('/bin/bash', '') : ''
}

async function mkdir(dirName) {
  await $`mkdir -p ${dirName}`.nothrow()
}

async function cp(fileName) {
  await $`touch ${fileName} && chmod +x ${fileName} && curl -s ${BASE_URL}/${fileName} > ${fileName}`
}
