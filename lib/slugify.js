'use strict'

const slug = require('slug')

// todo: https://en.wikipedia.org/wiki/Wikipedia:Page_name#Spaces.2C_underscores_and_character_coding
const slugify = (title) => {
	return slug(title, {
		replacement: '_',
		lower: false
	})
}

module.exports = slugify
