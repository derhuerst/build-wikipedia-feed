#!/usr/bin/env node
'use strict'

const esc = require('ansi-escapes')
const {isatty} = require('tty')
const {stringify} = require('ndjson')

const parseDump = require('./lib/parse-dump')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

let clear = '\n'
if (isatty(process.stderr.fd) && !isatty(process.stdout.fd)) {
	clear = esc.eraseLine + esc.cursorTo(0)
}
const report = (pages, revisions) => {
	process.stderr.write(clear + pages + ' pages, ' + revisions + ' revisions')
}

parseDump(process.stdin, report, showError)
.pipe(stringify())
.on('error', showError)
.pipe(process.stdout)
.on('error', showError)
