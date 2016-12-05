const CategoriseActivityPage = function CategoriseActivityPage(browser) {
  this.browser = browser;

  this.visit = (accountId, activityId) =>
    this.browser.visit(`/${accountId}/categorise-activity/${activityId}`);
  this.headingToBe = (heading) => browser.assert.text('[data-test="heading"]', heading);
};

module.exports = CategoriseActivityPage;
