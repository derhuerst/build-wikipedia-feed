#!/usr/bin/env node
'use strict'

const esc = require('ansi-escapes')
const {isatty} = require('tty')
const {parse} = require('ndjson')
const hyperdrive = require('hyperdrive')

const fetchRevisions = require('./lib/fetch-revisions')
const writeToHyperdrive = require('./lib/write-to-hyperdrive')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const DB = process.env.DB
if (!DB) showError('Missing DB env var.')

let clear = '\n'
if (isatty(process.stderr.fd) && !isatty(process.stdout.fd)) {
	clear = esc.eraseLine + esc.cursorTo(0)
}
const report = (slug, revId) => {
	process.stderr.write(clear + slug + ' ' + revId)
}

const drive = hyperdrive(DB)
const sink = writeToHyperdrive(drive)

process.stdin
.on('error', showError)
.pipe(parse())
.on('error', showError)
.pipe(fetchRevisions)
.on('error', showError)
.pipe(sink)
.on('error', showError)
