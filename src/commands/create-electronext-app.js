const _repo_config = require('../repo.config.json')

const command = {
  name: 'create-electronext-app',
  run: async (toolbox) => {
    const { print, parameters, filesystem } = toolbox
    const pm = (process.env.npm_config_user_agent || '').indexOf('yarn') === 0

    //@Current Directory
    //const _current_dir = filesystem.cwd()

    //@First Parameter = App Name
    let _app_name = parameters.first
    let _app_name_exists = _app_name ? await filesystem.exists(_app_name) : null

    function Finaly(_app_name, pm) {
      print.success(`
● ElectroNext ${_app_name} App created with success!`)
      print.highlight(`
- cd ${_app_name} 
- ${pm ? 'yarn' : 'npm'} run dev

Leave your star at:
https://github.com/electronextjs/ElectroNext.js
    `)
    }

    async function validateRepoFiles(owner, repo, paths) {
      const { Octokit } = require('@octokit/rest')
      const spinner = toolbox.print.spin('Validating ElectroNext files...')
      try {
        await new Octokit().repos.getContent({
          owner,
          repo,
          paths,
        })

        spinner.succeed('Validated files')
      } catch (error) {
        spinner.fail('Validating Failed!')
        print.error(error)
      }
    }

    async function downloadRepoFiles(_app_name) {
      const mainUrl = `https://codeload.github.com/${_repo_config.owner}/${_repo_config.repo}/tar.gz/main`
      const _app_dir = filesystem.dir(_app_name).cwd()

      const { default: got } = await import('got')
      const { x } = require('tar')

      const spinner = toolbox.print.spin('Downloading ElectroNext files...')

      try {
        await new Promise((resolve) => {
          got
            .stream(mainUrl)
            .pipe(x({ cwd: _app_dir, strip: 1 }, [`${_repo_config.repo}-main`]))
            .on('finish', () => resolve())
        })

        spinner.succeed('Downloaded files')
      } catch (error) {
        spinner.fail('Download Failed!')
        print.error(error)
        filesystem.remove(_app_dir)
      }
    }

    async function installDependencies(_app_name, pm) {
      const { promisify } = require('util')
      const { exec: defaultExec } = require('child_process')
      const exec = promisify(defaultExec)
      const cwd = filesystem.dir(_app_name).cwd()

      const spinner = toolbox.print.spin(
        'Installing ElectroNext dependencies. This might take a couple of minutes.'
      )

      await exec(
        `${pm ? 'yarn' : 'npm'} i `,
        {
          cwd,
        },
        (error, stdout, stderr) => {
          if (error) {
            spinner.fail('Install dependencies Failed!')
            print.error(error.message)
            return
          }
          if (stderr) {
            spinner.fail('Install dependencies Failed!')
            print.error(stderr)
            return
          }
          spinner.succeed('Installed Dependencies')
          Finaly(_app_name, pm)
        }
      )
    }

    async function createElectroNextApp() {
      await validateRepoFiles(_repo_config.owner, _repo_config.repo)
      await downloadRepoFiles(_app_name)
      await installDependencies(_app_name, pm)
    }

    //@verifications
    if (!_app_name) {
      print.error(`● App name must be specified!`)
      return
    }
    if (_app_name_exists == 'dir') {
      print.error(`● An app with that name already exists!`)
      return false
    }

    //@starting
    print.highlight(`
● Starting create-electronext-app ${_app_name} 
    `)
    await createElectroNextApp()
  },
}

module.exports = command
