'use strict'

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
		const dest = path.join(ns, slug + '.html')

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
