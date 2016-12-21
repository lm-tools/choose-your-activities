const CategoriseActivityPage = function CategoriseActivityPage(browser) {
  this.browser = browser;

  this.visit = (accountId, activityId) =>
    this.browser.visit(`/${accountId}/activities/${activityId}/categorise`);
  this.headingToBe = (heading) => browser.assert.text('[data-test="heading"]', heading);
  this.countCategories = () => browser.queryAll('[data-test="menu-item"]').length;
  this.browserPath = () => browser.location.pathname;
  this.browserQuery = () => browser.location.search;
  this.selectCategory = (category) => browser.pressButton(category);
};

module.exports = CategoriseActivityPage;
