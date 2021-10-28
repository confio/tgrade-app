#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

if [ $# -ne 2 ]; then
  echo "Usage: ./download_releases.sh cwplus_tag tfi_tag"
  exit 1
fi

cwplus_tag="$1"
tfi_tag="$2"

# load token from OS keychain when not set via ENV
GITHUB_API_TOKEN=${GITHUB_API_TOKEN:-"$(security find-generic-password -a "$USER" -s "github_api_key" -w)"}

# delete local contracts and versions
rm -f *.wasm
rm -f version.txt

CWPLUS="cw20_base"
for contract in $CWPLUS; do
  list_asset_url="https://api.github.com/repos/CosmWasm/cw-plus/releases/tags/${cwplus_tag}"
  # get url for artifact with name==${contract}.wasm
  artifact_url=$(curl -H "Accept: application/vnd.github.v3+json" -H "Authorization: token $GITHUB_API_TOKEN" "${list_asset_url}" | jq -r ".assets[] | select(.name==\"${contract}.wasm\") | .url")
  # download the artifact
  curl -LJO -H 'Accept: application/octet-stream' -H "Authorization: token $GITHUB_API_TOKEN" "$artifact_url"
done
echo "CWPLUS_TAG=$cwplus_tag" >> version.txt

TFI="dso_token tfi_factory tfi_pair"
for contract in $TFI; do
  list_asset_url="https://api.github.com/repos/confio/tfi/releases/tags/${tfi_tag}"
  # get url for artifact with name==${contract}.wasm
  asset_url=$(curl -H "Accept: application/vnd.github.v3+json" -H "Authorization: token $GITHUB_API_TOKEN" "${list_asset_url}" | jq -r ".assets[] | select(.name==\"${contract}.wasm\") | .url")
  # download the artifact
  curl -LJO -H 'Accept: application/octet-stream' -H "Authorization: token $GITHUB_API_TOKEN" "$asset_url"
done
echo "TFI_TAG=$tfi_tag" >> version.txt

echo "Done. All artifacts downloaded and versions updated."
