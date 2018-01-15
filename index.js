#!/usr/bin/env node

'use strict'

const execa = require('execa')
const inquirer = require('inquirer')
const pkgScript = require('pkg-script')

const logger = console

module.exports = (async () => {
	const pkgScriptList = await pkgScript.get()
	await inquirer
		.prompt([
			{
				type: 'list',
				message: 'Run npm script via terminal',
				name: 'value',
				choices: Object.keys(pkgScriptList).map(key => key)
			}
		])
		.then(answers => {
			(async () => {
				const {stdout} = await execa(pkgScriptList[answers['value']])
				logger.log(stdout)
			})()
		})
})()