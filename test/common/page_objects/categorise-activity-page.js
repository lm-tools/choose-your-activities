const CategoriseActivityPage = function CategoriseActivityPage(browser) {
  this.browser = browser;

  this.visit = (accountId, activityId) =>
    this.browser.visit(`/${accountId}/categorise-activity/${activityId}`);
  this.headingToBe = (heading) => browser.assert.text('[data-test="heading"]', heading);
  this.countCategories = () => browser.queryAll('[data-test="title"]').length;
};

module.exports = CategoriseActivityPage;
