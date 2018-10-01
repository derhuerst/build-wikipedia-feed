# build-wikipedia-feed

**Build a [hyperdb](https://npmjs.com/package/hyperdb) feed of Wikipedia articles**, including historical revisions.

[![npm version](https://img.shields.io/npm/v/build-wikipedia-feed.svg)](https://www.npmjs.com/package/build-wikipedia-feed)
[![build status](https://img.shields.io/travis/derhuerst/build-wikipedia-feed.svg)](https://travis-ci.org/derhuerst/build-wikipedia-feed)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/build-wikipedia-feed.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Rationale

### Problem

[Wikipedia](https://en.wikipedia.org/wiki/Wikipedia) is an incredibly important collection of knowledge on the internet. It is free to read and edit for everyone. Though, it is important to know that **it is stored on only a handful of servers in a handful of countries controlled by a single organisation**. This mainly causes two problems:

- Currently, it is **too easy to censor** the Wikipedia. We need a system that supports redundancy without any additional effort.
- It **does not work offline**. Making an offline copy is complicated. Also, you usually have to download all articles for a language.

### Solution

Let's **store Wikipedia's content in a [peer-to-peer (P2P) system](https://en.wikipedia.org/wiki/Peer-to-peer)**. By leveraging software from [the *Dat* project](https://docs.datproject.org), we won't have to reinvent the wheel. [The *Dat* protocol](https://github.com/datproject/docs/blob/master/papers/dat-paper.pdf) efficiently only syncs changes between to versions of data, allows for sparse & live replication and is completely [distributed](https://en.wikipedia.org/wiki/Peer-to-peer#Unstructured_networks).

This tool can extract articles from a [Wikipedia dump](https://dumps.wikimedia.org/enwiki) or download it directly, and store it in a *Dat* archive. See below for more details.


## Installing

```shell
npm install -g build-wikipedia-feed
```


## Usage

This module exposes several command line building blocks.

### read *all* revisions of every article

Pipe [a `stub-meta-history*` XML file](https://dumps.wikimedia.org/enwiki/) into `wiki-revisions-list`. You will get an [ndjson](http://ndjson.org) list of page revisions.

```shell
curl -s 'https://dumps.wikimedia.org/enwiki/20181001/enwiki-20181001-stub-meta-history1.xml.gz' | gunzip | wiki-revisions-list >revisions.ndjson
```

### read the *most recent* revision of every article

Pipe [a `stub-meta-current*` XML file](https://dumps.wikimedia.org/enwiki/) file into `wiki-revisions-list`. You will get an [ndjson](http://ndjson.org) list of page revisions.

```shell
curl -s 'https://dumps.wikimedia.org/enwiki/20181001/enwiki-20181001-stub-meta-current1.xml.gz' | gunzip | wiki-revisions-list >revisions.ndjson
```

### read articles being *edited right now*

Use `wiki-live-revisions`. You will get an [ndjson](http://ndjson.org) list of page revisions.

```shell
wiki-live-revisions >revisions.ndjson
```

### fetch & store revisions in a [hyperdb](https://npmjs.com/package/hyperdb)

Use `wiki-store-revisions` to write the HTML content of all revisions in `revisions.ndjson` into a [hyperdb](https://npmjs.com/package/hyperdb). The archive will be created under `p2p-wiki` in [your system's data directory](https://github.com/sindresorhus/env-paths#usage).

```shell
cat revisions.ndjson | wiki-store-revisions
```


## Related

- [distributed-wikipedia-mirror](https://github.com/ipfs/distributed-wikipedia-mirror) – Putting wikipedia on IPFS
- [`fetch-wikipedia-page-revision`](https://github.com/derhuerst/fetch-wikipedia-page-revision#fetch-wikipedia-page-revision) – Fetch a revision of a Wikipedia page as mobile HTML.
- [`wikipedia-edits-stream`](https://github.com/derhuerst/wikipedia-edits-stream#wikipedia-edits-stream) – A live stream of page edits on Wikipedia.
- [`commons-photo-url`](https://github.com/derhuerst/commons-photo-url#commons-photo-url) – Download Wikimedia Commons photos.
- [`wiki-article-name-encoding`](https://github.com/derhuerst/wiki-article-name-encoding#wiki-article-name-encoding) – Encode & decode Wiki(pedia) article names/slugs.


## Contributing

If you have a question or have difficulties using `build-wikipedia-feed`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/build-wikipedia-feed/issues).
