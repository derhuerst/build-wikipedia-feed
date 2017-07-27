#!/usr/bin/env node
'use strict'

const esc = require('ansi-escapes')
const {isatty} = require('tty')
const {stringify} = require('ndjson')

const liveRevisions = require('./lib/live-revisions')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

let clear = '\n'
if (isatty(process.stderr.fd) && !isatty(process.stdout.fd)) {
	clear = esc.eraseLine + esc.cursorTo(0)
}
const report = (edit) => {
	process.stderr.write(clear + edit.pageId + ' @ ' + edit.revId)
}

liveRevisions()
.on('error', showError)
.on('data', report)
.pipe(stringify())
.on('error', showError)
.pipe(process.stdout)
.on('error', showError)
