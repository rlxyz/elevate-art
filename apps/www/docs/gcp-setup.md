# Google Cloud Storage Setp

## Bucket Setup

1. Follow [this](https://cloud.google.com/cdn/docs/setting-up-cdn-with-bucket) guide to create the CDN bucket
2. Follow [this](https://cloud.google.com/dns/docs/tutorials/create-domain-tutorial) guide to create the DNS records. Note, the NS records' should use your subdomain (e.g if `localhost-assets.elevate.art` is your subdomain, the NS records should use `localhost-assets` as name with google's nameservers as values)

## Creating Google Service Accounts

1. Refer to [this](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#iam-service-account-keys-create-console) guide to create the Google Service Account.
2. Create a new key for the service account and download the JSON file based on this [link](https://console.cloud.google.com/iam-admin/serviceaccounts?walkthrough_id=iam--create-service-account-keys&start_index=1&_ga=2.178944484.1377933432.1673834605-832100739.1673834605#step_index=1).
