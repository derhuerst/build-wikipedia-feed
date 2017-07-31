# build-wikipedia-feed

**Build a [hyperdrive](https://github.com/mafintosh/hyperdrive) feed of Wikipedia articles**, including historical revisions.

[![npm version](https://img.shields.io/npm/v/build-wikipedia-feed.svg)](https://www.npmjs.com/package/build-wikipedia-feed)
[![build status](https://img.shields.io/travis/derhuerst/build-wikipedia-feed.svg)](https://travis-ci.org/derhuerst/build-wikipedia-feed)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/build-wikipedia-feed.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install build-wikipedia-feed
```


## Usage

This module exposes several command line building blocks.

### read *all* revisions of every article

Pipe [a `stub-meta-history` XML file](https://dumps.wikimedia.org/enwiki/20170701/) into `build-revisions-list`. You will get an [ndjson](http://ndjson.org) list of page revisions.

```shell
curl -s 'https://dumps.wikimedia.org/enwiki/20170701/enwiki-20170701-stub-meta-history.xml.gz' | gunzip | build-revisions-list >revisions.ndjson
```

### read the *most recent* revision of every article

Pipe [a `stub-meta-current` XML file](https://dumps.wikimedia.org/enwiki/20170720/) file into `build-revisions-list`. You will get an [ndjson](http://ndjson.org) list of page revisions.

```shell
curl -s 'https://dumps.wikimedia.org/enwiki/20170720/enwiki-20170720-stub-meta-current.xml.gz' | gunzip | build-revisions-list >revisions.ndjson
```

## read articles being *edited right now*

Use `live-revisions`. You will get an [ndjson](http://ndjson.org) list of page revisions.

```shell
live-revisions >revisions.ndjson
```

### fetch & store revisions in a [hyperdrive](https://github.com/mafintosh/hyperdrive)

This will write the HTML content of all revisions in `revisions.ndjson` into a [hyperdrive](https://github.com/mafintosh/hyperdrive).

```shell
cat revisions.ndjson | env DB=path/to/hyperdrive store-revisions
```


## Contributing

If you have a question or have difficulties using `build-wikipedia-feed`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/build-wikipedia-feed/issues).
