#!/bin/sh

curl -s 'https://dumps.wikimedia.org/enwiki/20170701/enwiki-20170701-stub-meta-history.xml.gz' | gunzip | ./build-revisions-list.js | gzip -9 >revisions.ndjson.gz
