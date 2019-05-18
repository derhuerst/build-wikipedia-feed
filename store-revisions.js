#!/usr/bin/env node
'use strict'

const mkdirp = require('mkdirp')
const path = require('path')
const envPaths = require('env-paths')
const esc = require('ansi-escapes')
const {isatty} = require('tty')
const {parse} = require('ndjson')
const hyperdrive = require('hyperdrive')

const fetchRevisions = require('./lib/fetch-revisions')
const writeToHyperdrive = require('./lib/write-to-hyperdrive')

const FEED_VERSION = 2

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const dir = envPaths('p2p-wiki', {suffix: ''}).data
mkdirp.sync(dir)
const dbPath = path.join(dir, 'db')

let clear = '\n'
if (isatty(process.stderr.fd) && !isatty(process.stdout.fd)) {
	clear = esc.eraseLine + esc.cursorTo(0)
}
const report = (slug, revId) => {
	process.stderr.write(clear + slug + ' @ ' + revId)
}

let concurrency = process.env.CONCURRENCY
if (!concurrency || Number.isNaN(concurrency = parseInt(concurrency))) {
	concurrency = 4
}

const db = hyperdrive(dbPath)
db.ready((err) => {
	if (err) return showError(err)
	const keyAsHex = db.key.toString('hex')
	console.info(dbPath, keyAsHex)

	if (!db.resumed) {
		const wikiMeta = JSON.stringify({
			version: FEED_VERSION,
			wiki: 'enwiki'
		})
		db.writeFile('/wiki.json', wikiMeta, (err) => {
			if (err) showError(err)
		})
	}

	const sink = writeToHyperdrive(db)

	process.stdin
	.on('error', showError)
	.pipe(parse())
	.on('error', showError)
	.pipe(fetchRevisions(concurrency))
	.on('error', showError)
	.pipe(sink)
	.on('error', showError)

	process.once('exit', () => {
		db.close()
	})
})
