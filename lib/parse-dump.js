'use strict'

const createParser = require('xml-flow')
const PassThrough = require('readable-stream/passthrough')

const slugify = require('./slugify')

// namespaces
const PAGES = 0

const parser = (input, report, onError) => {
	let pages = 0, revisions = 0
	const onPage = (page) => {
		if (+page.ns !== PAGES) return
		pages++

		// todo: page.redirect
		for (let revision of page.revision) {
			const pageId = page.id[0]
			const slug = slugify(page.title[0])
			const revId = revision.id
			const timestamp = +new Date(revision.timestamp)

			if (Number.isNaN(timestamp)) {
				onError(new Error(`${pageId} @ ${revId}: invalid timestamp`))
				continue
			}

			out.write({pageId, slug, revId, timestamp})
			revisions++
			report(pages, revisions)
		}
	}

	const parser = createParser(input, {useArrays: createParser.ALWAYS})
	parser.on('error', onError)
	parser.on('tag:page', onPage)

	const out = new PassThrough({objectMode: true})
	out.on('error', onError)
	return out
}

module.exports = parser
