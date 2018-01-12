#!/usr/bin/env node

'use strict'

const ora = require('ora')
const chalk = require('chalk')
const inquirer = require('inquirer')
const pkgScript = require('pkg-script')
const { spawn } = require('child_process')

const logger = console

module.exports = (async () => {
	const pkgScriptList = await pkgScript.get()
	await inquirer
		.prompt([
			{
				type: 'list',
				message: 'Run npm scripts via terminal',
				name: 'value',
				choices: Object.keys(pkgScriptList).map(key => key)
			}
		])
		.then(answers => (async () => {
			const spinner = await ora({
				text: chalk.green(`${answers['value']} running \n`),
				spinner: {
					'interval': 80,
					'frames': [
						'⣾',
						'⣽',
						'⣻',
						'⢿',
						'⡿',
						'⣟',
						'⣯',
						'⣷'
					]
				}
			})
      
			const child = await spawn(/^win/.test(global.process.platform) ? 'npm.cmd' : 'npm', ['run', answers['value']])

			child.stdout.on('data', (data) => {
				spinner.start()
				logger.log(`${data}`)
			})
      
			child.stderr.on('data', (data) => {
				spinner.stop()
				logger.log(`${data}`)
			})
      
			child.on('close', () => {
				spinner.stop()
				logger.log(`${chalk.cyan('Re-run using run-npms')}`)
				global.process.exit(1)
			})
		})()
		)
})()