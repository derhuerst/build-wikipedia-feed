'use strict'

const createParser = require('xml-flow')
const PassThrough = require('readable-stream/passthrough')

// namespaces
const PAGES = 0

const parser = (input, report, onError) => {
	let pages = 0, revisions = 0
	const onPage = (page) => {
		if (+page.ns !== PAGES) return
		pages++

		// todo: page.redirect
		for (let revision of page.revision) {
			out.write({
				pageId: page.id,
				slug: page.title,
				revId: revision.id,
				timestamp: revision.timestamp
			})

			revisions++
			report(pages, revisions)
		}
	}

	const parser = createParser(input, {useArray: createParser.ALWAYS})
	parser.on('error', onError)
	parser.on('tag:page', onPage)

	const out = new PassThrough({objectMode: true})
	out.on('error', onError)
	return out
}

module.exports = parser
