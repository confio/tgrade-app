# Contracts
Tgrade smart contracts


## Download new artifacts
**Requires a github access token**

Example to download contracts for CosmWasm plus `v0.1.2`, and tfi `v0.5.6`.
```sh
./download_releases.sh v0.1.2 v0.5.6
```

### OSX
### Preparation
1. Create access token on [github](https://github.com/settings/tokens) with access to private repos!

#### Store key in OS keychain
1. Copy token to clipboard
1. Add to your OS keychain
```sh
security add-generic-password -a "$USER" -s 'github_api_key' -w "$(pbpaste)"
```
The script will read the token from the OS keychain

### Others
Set your api key via environment `GITHUB_API_TOKEN` variable before running the download script
