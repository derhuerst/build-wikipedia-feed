'use strict'

const fetchPageRevision = require('wikipedia-articles-feed/fetch-page-revision')
const through = require('through2')

const transform = ({slug, revId}, _, cb) => {
	fetchPageRevision(slug, revId)
	.then((content) => {
		cb(null, {slug, revId, content})
	}, cb)
}

const fetchRevisions = through.obj(transform)

module.exports = fetchRevisions
