'use strict'

const esc = require('ansi-escapes')
const {isatty} = require('tty')
const createParser = require('xml-flow')
const {stringify} = require('ndjson')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

// namespaces
const PAGES = 0

let clear = '\n'
if (isatty(process.stderr.fd) && !isatty(process.stdout.fd)) {
	clear = esc.eraseLine + esc.cursorTo(0)
}

let pages = 0, revisions = 0
const onPage = (page) => {
	if (+page.ns !== PAGES) return
	pages++

	// todo: page.redirect
	for (let revision of page.revision) {
		revisions++
		sink.write([page.id, page.title, revision.id, revision.timestamp])
		process.stderr.write(clear + pages + ' pages, ' + revisions + ' revisions')
	}
}

const parser = createParser(process.stdin, {useArray: createParser.ALWAYS})
parser.on('error', showError)
parser.on('tag:page', onPage)

const sink = stringify()
sink
.on('error', showError)
.pipe(process.stdout)
.on('error', showError)
