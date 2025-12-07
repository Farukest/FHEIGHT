#!/usr/bin/env bash
docker compose down
docker rm fheight-db-1
docker rm fheight-migrate-1
rm -rf .pgdata
