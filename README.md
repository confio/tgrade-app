<p align="center">
    <img src="public/apple-touch-icon.png" width="130" height="130">
</p>

# Tgrade
Tgrade is a public, permissionless blockchain designed with decentralisation at its heart.

## Get started
- connection to blockchain via Docker (Win, Mac Intel) or Digital Ocean (Mac M1) `$ REMOTE=root@164.92.85.248 ./scripts/remote_start.sh`
- `$ yarn start:local`


## Integration tests
- `$ yarn test` // to run tests locally
- `$ yarn test:coverage` // generate test coverage

### E2E tests
[![CircleCI](https://circleci.com/gh/confio/tgrade-app.svg?style=svg&circle-token=d8a2d49cb73749882fd6378a49f27b3806dd2f19)](https://circleci.com/gh/confio/tgrade-app)
> E2E tests is using opensource framework called Cypress https://docs.cypress.io/guides/overview/why-cypress

##### Usage
- `$ cy:open:local` // will open "Test runner" to run on http://localhost:3000/
- `$ cy:run:local` // to run on http://localhost:3000/ in headless mode

the same rules applied for running tests in Circleci more details in workflows:
[.circleci/config.yml](.circleci/config.yml)

## Deployment to `*.tgrade.finance` websites
- how to deploy [slab.com/posts](https://confio.slab.com/posts/how-to-deploy-tgrade-app-lc40xuws)
- how to rollback [slab.com/posts](https://confio.slab.com/posts/how-to-rollback-tgrade-app-release-c1xr3zeb)

## Project structure:
```
  ├── src
  │   ├── ...
  │   ├── codec
  │   └── ...
```

- all files and context inside [src/codec](/src/codec) folder generated automatically based on [scripts/proto/codegen.sh](scripts/proto/codegen.sh) script, more details see in [scripts/proto/get-proto.sh](scripts/proto/get-proto.sh)

