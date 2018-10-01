#!/bin/sh

curl -s 'https://dumps.wikimedia.org/enwiki/20181001/enwiki-20181001-stub-meta-history1.xml.gz' | gunzip | ./revisions-list.js | gzip -9 >revisions.ndjson.gz
