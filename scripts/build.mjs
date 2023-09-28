#!/usr/bin/env zx

import * as dotenv from 'dotenv'

const exclude = fs.readFileSync('.buildignore').toString().split('\n').filter((line) => line !== '')
const env = dotenv.parse(await fs.readFile(`.env`, 'utf8'))
const files = getAllFilePaths(process.cwd())

if (argv.env === 'development') {
  for (const file of files) {
    const content = await fs.readFile(file, 'utf8')
    const result = content.replace(new RegExp(env.PRODUCTION_HOST, 'g'), env.DEVELOPMENT_HOST)
    await fs.writeFile(file, result, 'utf8')
  }
}

if (argv.env === 'production') {
  for (const file of files) {
    const content = await fs.readFile(file, 'utf8')
    const result = content.replace(new RegExp(env.DEVELOPMENT_HOST, 'g'), env.PRODUCTION_HOST)
    await fs.writeFile(file, result, 'utf8')
  }

  await $`git add .`
  await $`git commit --no-verify -m "build: change HOST"`
}

function getAllFilePaths(dirPath) {
  const filePaths = []
  const files = fs.readdirSync(dirPath).filter((file) => !exclude.includes(file))

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    
    if (fs.lstatSync(filePath).isDirectory()) {
      filePaths.push(...getAllFilePaths(filePath))
    } else {
      filePaths.push(filePath)
    }
  }

  return filePaths
}
