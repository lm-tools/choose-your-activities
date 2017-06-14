const urlChecker = require('./../../scripts/url-checker');
const { describe, it, beforeEach } = require('mocha');
const { expect } = require('chai');
const nock = require('nock');

describe('url checker', function () {
  beforeEach(() => {
    nock('http://url.respond.with.404').get('/').reply(404);
    nock('http://url.respond.with.500').get('/').reply(500);
    nock('http://url.respond.with.200').get('/').reply(200);
  });

  [
    {
      name: 'should return empty result when no urls',
      input: [{ name: 'empty', body: '' }],
      output: { result: [{ name: 'empty', brokenLinks: [] }], brokenLinksCount: 0 },
    },
    {
      name: 'should find broken link',
      input: [
        { name: 'single', body: '<div><a href="http://url.respond.with.404"></a></div>' },
      ],
      output: {
        result: [
          {
            name: 'single',
            brokenLinks: [{
              url: 'http://url.respond.with.404',
              reason: '404',
            }],
          },
        ],
        brokenLinksCount: 1,
      },
    },
    {
      name: 'should find multiple broken links in the same body',
      input: [
        {
          name: 'single',
          body: '<div><a href="http://url.respond.with.404"></a></div>' +
          '<a href="http://url.respond.with.500"></a>',
        },
      ],
      output: {
        result: [
          {
            name: 'single',
            brokenLinks: [
              {
                url: 'http://url.respond.with.404',
                reason: '404',
              },
              {
                url: 'http://url.respond.with.500',
                reason: '500',
              },
            ],
          },
        ],
        brokenLinksCount: 2,
      },
    },
    {
      name: 'should find multiple broken link in multiple bodies',
      input: [
        {
          name: 'article1',
          body: '<div><a href="http://url.respond.with.404"></a></div>',
        },
        {
          name: 'article2',
          body: '<div><a href="http://url.respond.with.404"></a></div>',
        },
      ],
      output: {
        result: [
          {
            name: 'article1',
            brokenLinks: [
              {
                url: 'http://url.respond.with.404',
                reason: '404',
              },
            ],
          },
          {
            name: 'article2',
            brokenLinks: [
              {
                url: 'http://url.respond.with.404',
                reason: '404',
              },
            ],
          },
        ],
        brokenLinksCount: 2,
      },
    },
    {
      name: 'shouldn\'t find any broken links when all are fine',
      input: [
        {
          name: 'article1',
          body: '<div><a href="http://url.respond.with.200"></a></div>' +
          '<a href="http://url.respond.with.200"></a>',
        },
        {
          name: 'article2',
          body: '<div><a href="http://url.respond.with.200"></a></div>',
        },
      ],
      output: {
        result: [
          {
            name: 'article1',
            brokenLinks: [],
          },
          {
            name: 'article2',
            brokenLinks: [],
          },
        ],
        brokenLinksCount: 0,
      },
    },
  ].forEach(s => {
    it(s.name, () => urlChecker(s.input).then(result => expect(result).to.eql(s.output)));
  });
});
