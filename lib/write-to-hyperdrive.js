'use strict'

const {Writable} = require('stream')

const writeToHyperdrive = (drive) => {
	// todo: what about the timestamp?
	const write = ({pageId, slug, revId, content, timestamp}, _, cb) => {
		if (!pageId) return cb(new Error('missing pageId field'))
		if (!slug) return cb(new Error('missing slug field'))
		if (!revId) return cb(new Error('missing revId field'))
		if (!content) return cb(new Error('missing content field'))
		if (!timestamp) return cb(new Error('missing timestamp field'))

		drive.writeFile(slug + '.html', content, {
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
