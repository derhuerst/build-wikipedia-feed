'use strict'

const fetchPageRevision = require('wikipedia-articles-feed/fetch-page-revision')
const through = require('through2')

const transform = (data, _, cb) => {
	fetchPageRevision(data.slug, data.revId)
	.then((content) => {
		data = Object.assign({}, data, {content})
		cb(null, data)
	}, cb)
}

const fetchRevisions = through.obj(transform)

module.exports = fetchRevisions
