#!/bin/sh

pnpm run build repository
pnpm run mongo:up
pnpm run notif:prod