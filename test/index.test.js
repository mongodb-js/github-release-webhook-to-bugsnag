var githubReleaseWebhookToBugsnag = require('../');
var assert = require('assert');

// var request = require('supertest');
// var express = require('express');
//
// var app = express();
//
// app.post('/notify-deploy', function(req, res) {
//   res.status(200).json({ name: 'tobi' });
// });
//
// app.get('/:owner/:repo/commits/:ref');

describe('github-release-webhook-to-bugsnag', function() {
  it('should work', function() {
    assert(githubReleaseWebhookToBugsnag);
  });
});
