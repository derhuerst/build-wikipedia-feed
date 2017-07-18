'use strict'

const createParser = require('xml-flow')
const ndjson = require('ndjson')
const zlib = require('zlib')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

// namespaces
const PAGES = 0

const onPage = (page) => {
	if (+page.ns !== PAGES) return

	// todo: page.redirect
	for (let revision of page.revision) {
		console.error(page.id, revision.id)
		sink.write(page.id, page.title, revision.id, revision.timestamp)
	}
}

const parser = createParser(process.stdin, {useArray: createParser.ALWAYS})
parser.on('error', showError)
parser.on('tag:page', onPage)

const sink = ndjson.stringify()
sink
.on('error', showError)
.pipe(zlib.createGzip())
.on('error', showError)
.pipe(process.stdout)
.on('error', showError)
