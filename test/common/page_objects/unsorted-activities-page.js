const UnsortedActivitiesPage = function UnsortedActivitiesPage(browser) {
  this.browser = browser;

  this.activityList = () => browser.queryAll('[data-test="title"]');
  this.visit = (accountId) => this.browser.visit(`/${accountId}/unsorted-activities`);
  this.browserPath = () => browser.location.pathname;
};

module.exports = UnsortedActivitiesPage;
