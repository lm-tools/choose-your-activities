const SortedActivitiesPage = function SortedActivitiesPage(browser, basePath) {
  this.browser = browser;
  this.basePath = basePath;

  this.visit = (version, accountId, activity) =>
    this.browser.visit(`${basePath}/${version}/${accountId}/activities/${activity.name}`);
  this.browserPath = () => browser.location.pathname;
  this.getTitle = () => browser.text('[data-test="title"]');
  this.getDetails = () => browser.text('[data-test="details"]');
  this.clickBackButton = () => browser.click('[data-test="backButton"]');
};

module.exports = SortedActivitiesPage;
