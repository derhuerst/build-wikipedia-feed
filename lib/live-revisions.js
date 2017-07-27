#!/usr/bin/env node
'use strict'

const through = require('through2')
const editsStream = require('wikipedia-edits-stream')
const onlyArticles = require('wikipedia-articles-feed/lib/is-english-article-change')

const parseEdit = (e, _, cb) => {
	cb(null, {
		pageId: e.id,
		pageSlug: e.meta.uri.split('wiki/')[1], // todo: make this robust
		revId: e.revision.new,
		timestamp: e.timestamp
	})
}

const parseEdits = () => through.obj(parseEdit)

const liveRevisions = () => {
	const out = parseEdits()
	const onError = (err) => out.emit('error', err)

	return editsStream()
	.on('error', onError)
	.pipe(onlyArticles())
	.on('error', onError)
	.pipe(parseEdits())
}

module.exports = liveRevisions
