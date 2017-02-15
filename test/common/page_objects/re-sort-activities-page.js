const ReSortActivitiesPage = function ReSortActivitiesPage(browser) {
  this.browser = browser;

  this.activityList = () => browser.queryAll('[data-test="title"]');
  this.visit = (accountId) => this.browser.visit(`/${accountId}/activities/re-sort`);
  this.browserPath = () => browser.location.pathname;
  this.activityCategories = () => browser.queryAll('[data-test="category"]').map(x => x.innerHTML);
  this.getActivitiesInCategory = (category) =>
    browser.queryAll(`[data-test="category-${category}"] li a`).map(x => x.innerHTML.trim());
  this.getCategoryDescription = category =>
    browser.text(`[data-test="category-${category}"] [data-test="empty-message"]`);
  this.isCategoryDescriptionVisible = category =>
    !browser.query(`[data-test="category-${category}"] [data-test="details"]`)
      .className.split(/\s+/).includes('js-hidden');
  this.clickCategoriseButton = (activity) =>
    browser.click(`[data-test="activity-${activity.name}"]`);
  this.clickContinueButton = () => browser.click('[data-test="continue-button"]');
  this.clickIntroductionLink = () => browser.click('[data-test="introduction-link"]');
};

module.exports = ReSortActivitiesPage;
