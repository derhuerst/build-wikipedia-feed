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

### read article revisions to be fetched

To get ***all* revisions of every article**, pipe [a `stub-meta-history` XML file](https://dumps.wikimedia.org/enwiki/20170701/) into `build-revisions-list`.

```shell
curl -s 'https://dumps.wikimedia.org/enwiki/20170701/enwiki-20170701-stub-meta-history.xml.gz' | gunzip | build-revisions-list >revisions.ndjson
```

To get ***only the most recent* revision of every article** instead, pipe [a `stub-meta-current`](https://dumps.wikimedia.org/enwiki/20170720/) file into `build-revisions-list`.

```shell
curl -s 'https://dumps.wikimedia.org/enwiki/20170720/enwiki-20170720-stub-meta-current.xml.gz' | gunzip | build-revisions-list >revisions.ndjson
```

To get **articles being *edited right now***, use `live-revisions`.

```shell
live-revisions >revisions.ndjson
```

You will get an [ndjson](http://ndjson.org) list of page revisions.

### fetch & store revisions in a DB

```shell
cat revisions.ndjson | env DB=path/to/hyperdrive store-revisions
```

This will store the HTML content of the selected revisions in a [hyperdrive](https://github.com/mafintosh/hyperdrive).


## Contributing

If you have a question or have difficulties using `build-wikipedia-feed`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/build-wikipedia-feed/issues).
