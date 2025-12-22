#!/bin/sh
set -e

if [ ! -d dist ]; then
	npm run format:check
	npm run build
fi

exec "$@"