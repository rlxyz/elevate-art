# apps-www

This is the core application for [elevate.art](https://elevate.art)

## Google Cloud Setup

### Bucket Setup

1. Follow [this](https://cloud.google.com/cdn/docs/setting-up-cdn-with-bucket) guide to create the CDN bucket
2. Follow [this](https://cloud.google.com/dns/docs/tutorials/create-domain-tutorial) guide to create the DNS records. Note, the NS records' should use your subdomain (e.g if `localhost-assets.elevate.art` is your subdomain, the NS records should use `localhost-assets` as name with google's nameservers as values)

## Creating Google Service Accounts

1. Refer to [this](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#iam-service-account-keys-create-console) guide to create the Google Service Account.
2. Create a new key for the service account and download the JSON file based on this [link](https://console.cloud.google.com/iam-admin/serviceaccounts?walkthrough_id=iam--create-service-account-keys&start_index=1&_ga=2.178944484.1377933432.1673834605-832100739.1673834605#step_index=1).

# Environments

The following are the environments that are available for the application.

1. `Production` - https://elevate.art
2. `Staging` - https://staging.elevate.art
3. `Localhost` - http://localhost:3000

## Google Cloud Storage (GCP)

This [link](https://console.cloud.google.com/iam-admin/serviceaccounts?walkthrough_id=iam--create-service-account-keys&project=elevate-apps-www-staging&supportedpurview=project) provides all the information about the service account.

1. Project ID = elevate-apps-www-`<env>`
2. Service Account Name = "storage-service-owner"
3. Service Account Roles = Storage Object Owner, Storage Object Viewer, Storage Object Admin
4. Service Account Email = "storage-service-owner@elevate-apps-www-`<env>`.iam.gserviceaccount.com"

We recommend to use this [link](https://console.cloud.google.com/iam-admin/serviceaccounts/details/103691944182436621216/keys?walkthrough_id=iam--create-service-account-keys&project=elevate-apps-www-`<env>`&supportedpurview=project) to manage the service account keys.

1. `Production` - elevate-asset-deployment-production-`<env>`
2. `Preview` - elevate-asset-deployment-preview-`<env>`

For the creation of the bucket, ensure that `STANDARD` access is selected, and `Uniform` access is selected with `Multi-Regional` location. Then, one would also need to ensure that the `allUsers` and `allAuthenticatedUsers` have the `Storage Object Viewer` role for the bucket.

## Inngest

We use Inngest for any event-driven actions that we need to perform. Currently, we use Inngest to perform the following actions:

1. Bundle the LayerElement assets for the `Production` and `Preview` environments.

Keys

1. Event Keys - apps-www-key-`staging`
2. Source Key - apps-www-source-`staging`
