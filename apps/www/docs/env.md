# Environments

The following are the environments that are available for the application.

1. `Production` - https://elevate.art
2. `Staging` - https://staging.elevate.art
3. `Localhost` - http://localhost:3000

## Google Cloud Storage (GCP)

This [link](https://console.cloud.google.com/iam-admin/serviceaccounts?walkthrough_id=iam--create-service-account-keys&project=elevate-apps-www-staging&supportedpurview=project) provides all the information about the service account.

1. Project ID = elevate-apps-www-<env>
2. Service Account Name = "storage-service-owner"
3. Service Account Roles = Storage Object Owner, Storage Object Viewer, Storage Object Admin
4. Service Account Email = "storage-service-owner@elevate-apps-www-<env>.iam.gserviceaccount.com"

We recommend to use this [link](https://console.cloud.google.com/iam-admin/serviceaccounts/details/103691944182436621216/keys?walkthrough_id=iam--create-service-account-keys&project=elevate-apps-www-`<env>`&supportedpurview=project) to manage the service account keys.

For Layers

1. elevate-assets-deployment-layers-<env>

For Tokens; based on AssetDeploymentBranch; i.e `Production` or `Preview` as elevate-assets-deployment-tokens-<branch>-<env>

1. elevate-assets-deployment-tokens-production-<env>
2. elevate-assets-deployment-tokens-preview-<env>

e.g for the `Production` environment, the bucket names would be: (i) elevate-assets-deployment-layers-production, (ii) elevate-assets-deployment-tokens-production

For the creation of the bucket, ensure that `STANDARD` access is selected, and `Uniform` access is selected with `Multi-Regional` location. Then, one would also need to ensure that the `allUsers` and `allAuthenticatedUsers` have the `Storage Object Viewer` role for the bucket.

## Inngest

We use Inngest for any event-driven actions that we need to perform. Currently, we use Inngest to perform the following actions: (i) bundle the LayerElement assets for the `Production` and `Preview` environments.

1. Event Keys - apps-www-key-<env>
2. Source Key - apps-www-source-<env>
