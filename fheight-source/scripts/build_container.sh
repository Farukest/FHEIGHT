#!/usr/bin/env bash

# Helper function for error handling.
quit () {
	echo $1
	exit 1
}

# Parse arguments.
SERVICE=$1
if [ -z $SERVICE ]; then quit "Usage: build_container.sh <service> <version>"; fi
VERSION=$2
if [ -z $VERSION ]; then VERSION=testing; fi

# Build the service image.
docker build \
	-f docker/$SERVICE.Dockerfile \
	-t fheight-$SERVICE:$VERSION \
	. || quit "Failed to build service image!"

echo "Successfully built image fheight-${SERVICE}:${VERSION}"
