#!/usr/bin/env zx

const HOST = 'https://now.box.toys'
const BASE_URL = `${HOST}/templates/nuxt`

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
      await cp('package.json')
      
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
