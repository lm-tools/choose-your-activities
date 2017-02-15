const SortedActivitiesPage = function SortedActivitiesPage(browser) {
  this.browser = browser;

  this.activityList = () => browser.queryAll('[data-test="title"]');
  this.visit = (accountId) => this.browser.visit(`/${accountId}/activities/sorted`);
  this.browserPath = () => browser.location.pathname;
  this.activityCategories = () => browser.queryAll('[data-test="category"]').map(x => x.innerHTML);
  this.getActivitiesInCategory = (category) =>
    browser.queryAll(`[data-test="category-${category}"] li p`).map(x => x.innerHTML.trim());
  this.getOpenCategory = (category) =>
    browser.query(`[data-test="category-${category}"] details[open]`);
  this.getCategoryDescription = category =>
    browser.text(`[data-test="category-${category}"] [data-test="empty-message"]`);
  this.clickDetailsButton = activity =>
    browser.click(`[data-test="activity-${activity.name}"] [data-test="details-button"]`);
  this.clickReSortActivitiesLink = () => browser.click('[data-test="re-sort-link"]');
  this.getCategorySummary = (category) =>
    browser.text(`[data-test="category-${category}"] [data-test="show-hide-text"]`);
  this.isMoveButtonDisplayed = (activity) =>
    !!browser.query(`[data-test="activity-${activity.name}-move"]`);
};

module.exports = SortedActivitiesPage;
