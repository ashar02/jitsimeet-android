#!/usr/bin/env bash

export ANDROID_HOME=$HOME/Library/Android/sdk
brew install jq
brew install mvn
rm -rf android/sdk/output
./android/scripts/release-sdk.sh android/sdk/output
