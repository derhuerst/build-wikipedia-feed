'use strict'

const deslugify = require('wiki-article-name-encoding/decode')
const slugify = require('wiki-article-name-encoding/encode')
const path = require('path')
const {Writable} = require('stream')

const writeToHyperdrive = (drive) => {
	const write = ({pageId, slug, revId, content, timestamp}, _, cb) => {
		if (!pageId) return cb(new Error('missing pageId field'))
		if (!slug) return cb(new Error('missing slug field'))
		if (!revId) return cb(new Error('missing revId field'))
		if (!content) return cb(new Error('missing content field'))
		if (!timestamp) return cb(new Error('missing timestamp field'))

		const ns = slug.slice(0, 2).toLowerCase()
		const file = slugify(deslugify(slug), true) + '.html'
		const dest = path.join(ns, file)

		drive.writeFile(dest, content, {
			mtime: timestamp, ctime: timestamp
		}, (err) => {
			if (err) return cb(err)
			console.info(`${pageId} (${slug}) @ ${revId} ✓`)
			cb()
		})
	}

	return new Writable({write, objectMode: true})
}

module.exports = writeToHyperdrive
