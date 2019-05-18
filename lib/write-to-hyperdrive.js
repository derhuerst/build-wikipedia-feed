'use strict'

const deslugify = require('wiki-article-name-encoding/decode')
const slugify = require('wiki-article-name-encoding/encode')
const path = require('path')
const {Writable} = require('stream')
const parallel = require('async/parallel')

const writeToHyperdrive = (db) => {
	const write = ({pageId, slug, revId, content, timestamp}, _, cb) => {
		if (!pageId) return cb(new Error('missing pageId field'))
		if (!slug) return cb(new Error('missing slug field'))
		if (!revId) return cb(new Error('missing revId field'))
		if (!content) return cb(new Error('missing content field'))
		if (!timestamp) return cb(new Error('missing timestamp field'))

		// todo: title
		const meta = JSON.stringify({
			page: pageId, slug, timestamp: Math.round(timestamp / 1000)
		})

		const ns = slug.slice(0, 2).toLowerCase()
		const dir = path.join(ns, slugify(deslugify(slug), true))

		const dataFile = path.join(dir, 'index.html')
		const metaFile = path.join(dir, 'index.json')

		parallel([
			cb => db.writeFile(dataFile, content, cb),
			cb => db.writeFile(metaFile, meta, cb)
		], (err) => {
			if (err) return cb(err)
			console.info(`${pageId} (${slug}) @ ${revId} ✓`)
			cb()
		})
	}

	return new Writable({write, objectMode: true})
}

module.exports = writeToHyperdrive
