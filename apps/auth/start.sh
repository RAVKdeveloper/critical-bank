#!/bin/sh

pnpm run build repository
pnpm run typeorm:up
pnpm run auth:prod