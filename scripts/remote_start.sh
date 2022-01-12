#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

# Usage:
# 1. Make sure you can login to your remote server without password on the default port (22)
# 2. Run `REMOTE=root@116.203.108.115 ./scripts/remote_start.sh` from the repo root with your user and host

echo "REMOTE = $REMOTE"

echo "Testing ssh connection ..."
ssh "$REMOTE" "date"

echo "Testing scp connection ..."
echo "Copy file test OK." > a_local_file.txt
scp a_local_file.txt "$REMOTE:~/a_remote_file.txt"
rm a_local_file.txt
ssh "$REMOTE" "cat ~/a_remote_file.txt"

echo "Updating packages …"
ssh -t "$REMOTE" "apt update -y && apt upgrade -y"

echo "Installing packages …"
ssh -t "$REMOTE" "apt install -y git docker.io cowsay"

echo "Installing node.js …"
ssh -t "$REMOTE" "curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh && bash nodesource_setup.sh"
ssh -t "$REMOTE" "apt install nodejs"
ssh -t "$REMOTE" "node --version"

echo "Copying scripts folder …"
scp -r ./scripts "$REMOTE:~/scripts"
# ssh "$REMOTE" "ls -lA ~/scripts"

echo "Install npm dependencies for deployment scripts …"
ssh -t "$REMOTE" "npm install @cosmjs/stargate @cosmjs/proto-signing @cosmjs/faucet-client @cosmjs/crypto @cosmjs/cosmwasm-stargate"

echo "Starting/restarting chain and faucet …"
ssh -t "$REMOTE" "./scripts/stop_all.sh"
ssh -t "$REMOTE" "./scripts/start_all.sh"

echo "Start port forwarding …"
# Local Port Forwarding, see https://help.ubuntu.com/community/SSH/OpenSSH/PortForwarding#Local_Port_Forwarding
PORT_RPC=26657
PORT_LCD=1317
PORT_FAUCET=8000
ssh -L "$PORT_RPC:localhost:$PORT_RPC" -L "$PORT_LCD:localhost:$PORT_LCD" -L "$PORT_FAUCET:localhost:$PORT_FAUCET" \
    "$REMOTE" \
    -t "cowsay 'Port forwarding enabled to localhost:$PORT_RPC, localhost:$PORT_LCD and localhost:$PORT_FAUCET on you local machine. Keep this shell session alive. Use the logout command or Ctrl+D, Ctrl+C to shut down the connection.' && bash -l"
