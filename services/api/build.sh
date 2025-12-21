#!/bin/sh
# Build script that ignores TypeScript errors but still emits files
tsc || true
tsc-alias
