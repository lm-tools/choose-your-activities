const SortedActivitiesPage = function SortedActivitiesPage(browser) {
  this.browser = browser;

  this.visit = (accountId, activity) =>
    this.browser.visit(`/${accountId}/activities/${activity.name}`);
  this.browserPath = () => browser.location.pathname;
  this.getTitle = () => browser.text('[data-test="title"]');
  this.getDetails = () => browser.text('[data-test="details"]');
  this.clickBackButton = () => browser.click('[data-test="backButton"]');
};

module.exports = SortedActivitiesPage;
