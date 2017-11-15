const cheerio = require('cheerio');
const request = require('request-promise');

// borrowed from https://hackernoon.com/functional-javascript-resolving-promises-sequentially-7aac18c4431e
const promiseSerial = funcs =>
  funcs.reduce((promise, func) =>
      promise.then(result => func.then(Array.prototype.concat.bind(result))),
    Promise.resolve([]));

function findAllLinks(body) {
  const $ = cheerio.load(`<div>${body}</div>`);
  return $('a').map((i, el) => $(el).attr('href')).get();
}

function makeGetRequest(url) {
  return request(
    {
      uri: url, method: 'GET', resolveWithFullResponse: true, simple: false,
      timeout: 30 * 1000,
      headers: {
        'User-Agent': 'request',
      },
    });
}

function checkSingleUrl(url) {
  return makeGetRequest(url)
    .then(result => ((result.statusCode !== 200) ? { url, reason: `${result.statusCode}` } : null))
    .catch(result => ({ url, reason: result.message }));
}

function checkLinks(document) {
  const links = findAllLinks(document.body);
  const pLinks = links.map(link => checkSingleUrl(link));
  return Promise.all(pLinks).then(result => ({
    name: document.name,
    brokenLinks: result.filter(i => !!i),
  }));
}

function check(htmlDocuments) {
  const pDocumentLinks = htmlDocuments.map(checkLinks);
  return promiseSerial(pDocumentLinks).then(result => {
    const brokenLinksCount = result
      .map(it => it.brokenLinks.length)
      .reduce((acc, cur) => acc + cur);
    return { brokenLinksCount, result };
  });
}


module.exports = check;
