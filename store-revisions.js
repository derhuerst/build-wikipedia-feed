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

const FEED_VERSION = 1

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

let concurrency = process.env.CONCURRENCY
if (!concurrency || Number.isNaN(concurrency = parseInt(concurrency))) {
	concurrency = 4
}

openDat(db, {indexing: false}, (err, dat) => {
	if (err) return showError(err)
	const keyAsHex = dat.key.toString('hex')
	console.error('dat', dat.path, keyAsHex)

	if (!dat.resumed) {
		const datMeta = JSON.stringify({
			url: `dat://${keyAsHex}/`,
			title: 'Wikipedia',
			description: 'A Wikipedia dump.'
		})
		dat.archive.writeFile('dat.json', datMeta, (err) => {
			if (err) showError(err)
		})

		const wikiMeta = JSON.stringify({
			version: FEED_VERSION,
			wiki: 'enwiki'
		})
		dat.archive.writeFile('wiki.json', wikiMeta, (err) => {
			if (err) showError(err)
		})
	}

	const sink = writeToHyperdrive(dat.archive)

	process.stdin
	.on('error', showError)
	.pipe(parse())
	.on('error', showError)
	.pipe(fetchRevisions(concurrency))
	.on('error', showError)
	.pipe(sink)
	.on('error', showError)

	process.once('exit', () => {
		dat.close()
	})
})
