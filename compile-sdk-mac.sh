#!/usr/bin/env bash

brew install jq
brew install mvn
rm -rf android/sdk/output
./android/scripts/release-sdk.sh android/sdk/output
