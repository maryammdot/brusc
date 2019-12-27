const fs = require('fs')
const shell = require('shelljs')

const config = require('./package')
const releaseVersion = process.env.TRAVIS_TAG.replace('v', '')

const GIT_ORIGIN = `https://alextremp:${process.env.GH_TOKEN}@github.com/alextremp/brusc.git`
const COMMIT_AUTHOR = 'Travis CI <travis@travis-ci.org>'
const COMMIT_MESSAGE = `Update version to: ${releaseVersion}`

const runCommand = function(command) {
  console.log('>' + command)
  shell.exec(command)
}

const isBeta = releaseVersion.indexOf('-beta.') > -1
config.version = releaseVersion

fs.writeFileSync('package.json', JSON.stringify(config, null, 2))

const commands = []
const branch = isBeta ? `beta/${releaseVersion}` : 'master'
commands.push('git config --global user.email "alextremp@hotmail.com"')
commands.push('git config --global user.name "Alex Castells"')
commands.push(`git checkout -b ${branch}`)
commands.push(`git push --set-upstream origin ${branch}`)
commands.push(`git remote rm origin`)
commands.push(`git remote add origin ${GIT_ORIGIN} > /dev/null 2>&1`)
commands.push('git add package.json')
commands.push(`git commit -m "${COMMIT_MESSAGE}" --author="${COMMIT_AUTHOR}"`)
commands.push(`git push origin ${branch} --quiet`)
commands.push(`npm publish${isBeta ? ' --tag beta' : ''}`)

commands.forEach(command => {
  runCommand(command)
})
