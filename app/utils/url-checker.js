const blc = require('broken-link-checker');

class UrlChecker {
  checkForDeadLinks(links) {
    return new Promise(resolve => {
      const brokenLinks = [];

      const htmlUrlChecker = new blc.HtmlUrlChecker({}, {
        link(result) {
          if (result.broken) {
            brokenLinks.push({ base: result.base.original, link: result.url.original });
          }
        },
        end() {
          resolve({ brokenLinks });
        },
      });

      links.forEach(link => htmlUrlChecker.enqueue(link));
    });
  }
}

module.exports = UrlChecker;
