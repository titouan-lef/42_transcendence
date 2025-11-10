#!/bin/sh
set -e

rm -rf dist

mkdir -p dist/public && cp node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm dist/public/

npm run format:check

npm run build

exec "$@"