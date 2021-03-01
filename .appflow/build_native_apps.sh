#!/bin/bash
if [[ -z ${BUILD_ANDROID} ]]
then
    echo "Skipping Android build"
else
    npx cap add android
fi

if [[ -z ${BUILD_IOS} ]]
then
    echo "Skipping iOS build"
else
    npx cap add ios
fi
