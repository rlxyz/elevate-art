# apps-www

This is the core application for [elevate.art](https://elevate.art)

## Google Cloud Setup

### Bucket Setup

1. Follow [this](https://cloud.google.com/cdn/docs/setting-up-cdn-with-bucket) guide to create the CDN bucket
2. Follow [this](https://cloud.google.com/dns/docs/tutorials/create-domain-tutorial) guide to create the DNS records. Note, the NS records' should use your subdomain (e.g if `localhost-assets.elevate.art` is your subdomain, the NS records should use `localhost-assets` as name with google's nameservers as values)
