#!/bin/sh
set -e

rm -rf dist

npm run format:check

npm run build

exec "$@"