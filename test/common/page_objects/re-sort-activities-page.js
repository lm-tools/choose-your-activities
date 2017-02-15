const ReSortActivitiesPage = function ReSortActivitiesPage(browser) {
  this.browser = browser;

  this.activityList = () => browser.queryAll('[data-test="title"]');
  this.visit = (accountId) => this.browser.visit(`/${accountId}/activities/sorted/resort`);
  this.browserPath = () => browser.location.pathname;
  this.activityCategories = () => browser.queryAll('[data-test="category"]').map(x => x.innerHTML);
  this.getActivitiesInCategory = (category) =>
    browser.queryAll(`[data-test="category-${category}"] li p`).map(x => x.innerHTML.trim());
  this.getCategoryDescription = category =>
    browser.text(`[data-test="category-${category}"] [data-test="empty-message"]`);
  this.isCategoryDescriptionVisible = category =>
    !browser.query(`[data-test="category-${category}"] [data-test="details"]`)
      .className.split(/\s+/).includes('js-hidden');
  this.isMoveButtonDisplayed = (activity) =>
    !!browser.query(`[data-test="activity-${activity.name}-move"]`);
  this.clickMoveButton = (activity) =>
    browser.click(`[data-test="activity-${activity.name}-move"]`);
  this.clickFinishSortingButton = () => browser.click('[data-test="finish-sorting-button"]');
};

module.exports = ReSortActivitiesPage;
