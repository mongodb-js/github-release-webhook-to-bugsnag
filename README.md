# github-release-webhook-to-bugsnag [![travis][travis_img]][travis_url] [![npm][npm_img]][npm_url]

> [Notify Bugsnag][deploy tracking] of a new deployment when [a new GitHub release is published][release event].

## Example

Designed for use with the excellent [`github-webhook-middleware`][github-webhook-middleware].

```bash
npm install --save github-release-webhook-to-bugsnag github-webhook-middleware
```

Add a new route for your GitHub webhook that uses the middleware:

```javascript
const app = require('express')();

...

const githubWebhook = require('github-webhook-middleware')({
  secret: process.env.REFRESH_SECRET
});

const notifyBugsnagOnRelease = require('github-release-webhook-to-bugsnag')({
  repo: process.env.GITHUB_REPO,
  token: process.env.GITHUB_TOKEN,
  bugsnag: process.env.BUGSNAG_NOTIFIER_KEY
});

app.post('/hooks/github', githubWebhook, notifyBugsnagOnRelease);

...
```

## Configuration

- *repo* `:username/:repo` path on GitHub. Uses the `GITHUB_REPO` environment variable if unspecified.
- *token* GitHub access token.  Uses the `GITHUB_TOKEN` environment variable if unspecified.
- *bugsnag* Bugsnag notifier token. Uses the `BUGSNAG_NOTIFIER_KEY` environment variable if unspecified.
- *githubEndpoint* For GitHub enterprise users. Uses the `GITHUB_ENDPOINT` environment variable if unspecified. Defaults to `https://api.github.com`.
- *bugsnagEndpoint* For Bugsnag enterprise users. Uses the `BUGSNAG_ENDPOINT` environment variable if unspecified. Defaults to `https://notify.bugsnag.com/deploy`.


## License

Apache 2.0

[travis_img]: https://img.shields.io/travis/mongodb-js/github-release-webhook-to-bugsnag.svg
[travis_url]: https://travis-ci.org/mongodb-js/github-release-webhook-to-bugsnag
[npm_img]: https://img.shields.io/npm/v/github-release-webhook-to-bugsnag.svg
[npm_url]: https://npmjs.org/package/github-release-webhook-to-bugsnag
[github-webhook-middleware]: https://npmjs.org/package/github-webhook-middleware
[deploy tracking]: https://docs.bugsnag.com/api/deploy-tracking/
[release event]: https://developer.github.com/v3/activity/events/types/#releaseevent
