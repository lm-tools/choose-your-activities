const SortedActivitiesPage = function SortedActivitiesPage(browser) {
  this.browser = browser;

  this.activityList = () => browser.queryAll('[data-test="title"]');
  this.visit = (accountId) => this.browser.visit(`/${accountId}/activities/sorted`);
  this.browserPath = () => browser.location.pathname;
  this.activityCategories = () => browser.queryAll('[data-test="category"]').map(x => x.innerHTML);
  this.getActivitiesInCategory = (category) =>
    browser.queryAll(`[data-test="category-${category}"] li p`).map(x => x.innerHTML.trim());
  this.getCategoryDescription = category =>
    browser.text(`[data-test="category-${category}"] [data-test="empty-message"]`);
  this.clickDetailsButton = activity =>
    browser.click(`[data-test="activity-${activity.name}"] [data-test="details-button"]`);
  this.clickReSortActivitiesLink = () => browser.click('[data-test="re-sort-link"]');
};

module.exports = SortedActivitiesPage;
