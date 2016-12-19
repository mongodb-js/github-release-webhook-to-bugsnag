const got = require('got');
const _ = require('lodash');
const debug = require('debug')('github-release-webhook-to-bugsnag');

/**
 * @param {Object} [opts]
 * @option {String} repo `:username/:repo` path on GitHub [Default: `process.env.GITHUB_REPO`].
 * @option {String} token GitHub access token [Default: `process.env.GITHUB_TOKEN`].
 * @option {String} bugsnag Bugsnag notifier token [Default: `process.env.BUGSNAG_NOTIFIER_KEY`].
 * @return {Function}
 * @api public
 */
module.exports = function(opts) {
  _.defaults(opts || {}, {
    repo: process.env.GITHUB_REPO,
    token: process.env.GITHUB_TOKEN,
    githubEndpoint: process.env.GITHUB_ENDPOINT || 'https://api.github.com',
    bugsnag: process.env.BUGSNAG_NOTIFIER_KEY,
    bugsnagEndpoint: process.env.BUGSNAG_ENDPOINT || 'https://notify.bugsnag.com/deploy'
  });

  if (!opts.repo) {
    throw new TypeError('Please set the GITHUB_REPO environment variable');
  }
  if (!opts.token) {
    throw new TypeError('Please set the GITHUB_TOKEN environment variable');
  }
  if (!opts.bugsnag) {
    throw new TypeError('Please set the BUGSNAG_NOTIFIER_KEY environment variable');
  }

  return function(req, res, next) {
    if (req.headers['x-github-event'] !== 'release') {
      debug(`Skipping non-release event ${req.headers['x-github-event']}`);
      return next();
    }

    const version = _.get(req, 'body.release.tag_name', '').replace('v', '');
    const branch = _.get(req, 'body.release.target_commitish');

    // @see https://developer.github.com/v3/repos/commits/#get-the-sha-1-of-a-commit-reference
    debug(`Resolving revision for ${version}`);
    return got.get(`${opts.githubEndpoint}/${opts.repo}/commits/v${version}`, {
      query: {
        access_token: opts.token
      }
    }).then(response => {
      debug(`Resolved ${version} to`, response.body);
      const sha = response.body.sha;

      return got.post(opts.bugsnagEndpoint, {
        body: {
          apiKey: opts.bugsnag,
          appVersion: version,
          repository: opts.githubEndpoint.replace('api.', ''),
          revision: sha,
          branch: branch
        }
      }).then(bugsnagResponse => {
        debug('Response from bugsnag is', bugsnagResponse.body);
        next();
      });
    }).catch(next);
  };
};
