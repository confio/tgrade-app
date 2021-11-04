#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

TGRADE_DIR="./scripts/proto/tgrade"
TGRADE_THIRD_PARTY_DIR="./scripts/proto/tgrade/third_party/proto"
OUT_DIR="./src/codec/"

mkdir -p "$OUT_DIR"

protoc \
  --plugin="$(yarn bin protoc-gen-ts_proto)" \
  --ts_proto_out="$OUT_DIR" \
  --proto_path="$TGRADE_DIR" \
  --proto_path="$TGRADE_THIRD_PARTY_DIR" \
  --ts_proto_opt="esModuleInterop=true,forceLong=long,useOptionals=true" \
  "$TGRADE_DIR/confio/poe/v1beta1/query.proto"
