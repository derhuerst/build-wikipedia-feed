'use strict'

const {Writable} = require('stream')

const writeToHyperdrive = (drive) => {
	// todo: what about the timestamp?
	const write = ({pageId, slug, revId, content, timestamp}, _, cb) => {
		drive.writeFile(slug + '.html', content, {
			mtime: timestamp, ctime: timestamp
		}, (err) => {
			if (err) return cb(err)
			console.info(`${pageId} @ ${revId} ✓`)
			cb()
		})
	}

	return new Writable({write, objectMode: true})
}

module.exports = writeToHyperdrive
