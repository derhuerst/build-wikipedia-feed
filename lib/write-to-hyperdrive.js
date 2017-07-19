'use strict'

const {Writable} = require('stream')

const writeToHyperdrive = (drive) => {
	// todo: what about the timestamp?
	const write = ({slug, revId, content}, _, cb) => {
		drive.writeFile(slug + '.html', content, (err) => {
			if (err) return cb(err)
			console.info(slug, revId, '✓')
			cb()
		})
	}

	return new Writable({write, objectMode: true})
}

module.exports = writeToHyperdrive
