'use strict'

const createParser = require('xml-flow')
const {Readable} = require('stream')
const slugify = require('wiki-article-name-encoding/encode')

// namespaces
const PAGES = 0

const parser = (input, report, onError) => {
	let wiki = null
	const onSiteinfo = (info) => {
		wiki = info.dbname[0]
	}

	let pages = 0, revisions = 0
	const onPage = (page) => {
		if (+page.ns !== PAGES) return
		pages++

		const pageId = page.id[0]
		const slug = slugify(page.title[0])

		// todo: page.redirect
		for (let revision of page.revision) {
			const revId = revision.id
			const timestamp = +new Date(revision.timestamp)

			if (Number.isNaN(timestamp)) {
				onError(new Error(`${pageId} @ ${revId}: invalid timestamp`))
				continue
			}

			out.push({wiki, pageId, slug, revId, timestamp})
			revisions++
			report(pages, revisions)
		}
	}

	const parser = createParser(input, {useArrays: createParser.ALWAYS})
	parser.on('error', onError)
	parser.once('tag:siteinfo', onSiteinfo)
	parser.on('tag:page', onPage)
	// todo: on end

	const out = new Readable({
		objectMode: true,
		read: () => {}
	})
	out.on('error', onError)
	return out
}

module.exports = parser
