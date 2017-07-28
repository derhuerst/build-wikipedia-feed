'use strict'

const fetchPageRevision = require('fetch-wikipedia-page-revision')
const concurrentThrough = require('through2-concurrent')

const transform = (data, _, cb) => {
	fetchPageRevision(data.slug, data.revId)
	.then((content) => {
		data = Object.assign({}, data, {content})
		cb(null, data)
	}, cb)
}

const fetchRevisions = concurrentThrough.obj({maxConcurrency: 4}, transform)

module.exports = fetchRevisions
