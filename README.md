## About
Tgrade is a public, permissionless blockchain designed with decentralisation at its heart.

## Get started
- before you run `$ yarn start:local` make sure to have connection to blockchain via Docker or Digital Ocean

## E2E tests
> E2E tests is using opensource framework called Cypress https://docs.cypress.io/guides/overview/why-cypress

##### Usage
- `$ cy:open:local` // will open "Test runner" to run on https://dev.tgrade.finance/
- `$ cy:open:dev` // to run on http://localhost:3000/

the same rules applied for running tests in Circleci more details in workflows:
[.circleci/config.yml](.circleci/config.yml)

## Integration tests
- `$ yarn test` // to run tests locally
- `$ yarn test:coverage` // generate test coverage

## Deployment to `*.tgrade.finance` websites
- how to deploy "Tgrade-App" [slab.com/posts](https://confio.slab.com/posts/how-to-deploy-tgrade-app-lc40xuws)
- how to rollback "Tgrade-App" [slab.com/posts](https://confio.slab.com/posts/how-to-rollback-tgrade-app-release-c1xr3zeb)
