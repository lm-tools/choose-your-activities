const SortedActivitiesPage = function SortedActivitiesPage(browser) {
  this.browser = browser;

  this.activityList = () => browser.queryAll('[data-test="title"]');
  this.visit = (accountId) => this.browser.visit(`/${accountId}/sorted-activities`);
  this.browserPath = () => browser.location.pathname;
  this.activityCategories = () => browser.queryAll('[data-test="category"]').map(x => x.innerHTML);
  this.getActivitiesInCategory = (category) =>
    browser.queryAll(`[data-test="category-${category}"] li span`).map(x => x.innerHTML.trim());
};

module.exports = SortedActivitiesPage;
