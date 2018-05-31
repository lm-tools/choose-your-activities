const CategoriseActivityPage = function CategoriseActivityPage(browser, basePath) {
  this.browser = browser;
  this.basePath = basePath;

  this.visit = (version, accountId, activityId) =>
    this.browser.visit(`${basePath}/${version}/${accountId}/activities/${activityId}/categorise`);
  this.visitFromActivityGroupPage = (version, accountId, group, activityId) => this.browser.visit(
    `${basePath}/${version}/${accountId}/groups/${group}/activities/${activityId}/categorise`);
  this.headingToBe = (heading) => browser.assert.text('[data-test="heading"]', heading);
  this.group = () => browser.text('[name="group"]');
  this.countCategories = () => browser.queryAll('[data-test="menu-item"]').length;
  this.browserPath = () => browser.location.pathname;
  this.browserQuery = () => browser.location.search;
  this.selectCategory = (category) => browser.pressButton(category);
};

module.exports = CategoriseActivityPage;
