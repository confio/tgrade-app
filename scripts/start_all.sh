#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"

# start up the blockchain and wait for it
"$SCRIPT_DIR/wasmd/start.sh" >/dev/null 2>&1 &
echo "Wait for wasmd to start..."
timeout 60 bash -c "until curl -s http://localhost:26657/validators?height=3 | grep -q block_height; do echo ...; sleep 0.5; done"
echo "3 blocks produced!"

"$SCRIPT_DIR/faucet/start.sh" &
echo "Wait for faucet to start up..."
timeout 60 bash -c "until curl -s http://localhost:8000/status > /dev/null; do sleep 0.5; done"

echo "Add CORS proxy (temporary)"
DOCKER_HOST_IP=$(docker run --read-only --rm alpine ip route | awk 'NR==1 {print $3}');
docker run --rm -t \
  --name proxy \
  -e PROXY_HOST="http://$DOCKER_HOST_IP:8000" \
  -p 8001:80 \
  mattbailey/docker-corsproxy

echo "All systems go!"
sleep 1
