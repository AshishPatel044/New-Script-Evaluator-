# Evaluation data

The evaluator uses a SHA-256 fingerprint of `show + genre + promo text` as the stable identity of a submission. This prevents score drift when the exact same promo is submitted again.

This folder is reserved for versioned evaluation metadata and benchmark labels. Vercel serverless functions do not provide a persistent writable filesystem, so runtime score caching must use an external database or KV store if durable storage is required across cold starts and deployments.
