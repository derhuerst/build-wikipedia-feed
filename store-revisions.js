#!/usr/bin/env node
'use strict'

const mkdirp = require('mkdirp')
const path = require('path')
const envPaths = require('env-paths')
const esc = require('ansi-escapes')
const {isatty} = require('tty')
const {parse} = require('ndjson')
const openDat = require('dat-node')

const fetchRevisions = require('./lib/fetch-revisions')
const writeToHyperdrive = require('./lib/write-to-hyperdrive')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const dir = envPaths('p2p-wiki', {suffix: ''}).data
mkdirp.sync(dir)
const db = path.join(dir, 'db')

let clear = '\n'
if (isatty(process.stderr.fd) && !isatty(process.stdout.fd)) {
	clear = esc.eraseLine + esc.cursorTo(0)
}
const report = (slug, revId) => {
	process.stderr.write(clear + slug + ' @ ' + revId)
}

openDat(db, (err, dat) => {
	if (err) return showError(err)
	console.error('dat', dat.path, dat.key.toString('hex'))

	const sink = writeToHyperdrive(dat.archive)

	process.stdin
	.on('error', showError)
	.pipe(parse())
	.on('error', showError)
	.pipe(fetchRevisions)
	.on('error', showError)
	.pipe(sink)
	.on('error', showError)

	process.once('exit', () => {
		dat.close()
	})
})
