const SortedActivitiesPage = function SortedActivitiesPage(browser) {
  this.browser = browser;

  this.activityList = () => browser.queryAll('[data-test="title"]');
  this.visit = (accountId) => this.browser.visit(`/${accountId}/sorted-activities`);
  this.browserPath = () => browser.location.pathname;
  this.activityCategories = () => browser.queryAll('[data-test="category"]').map(x => x.innerHTML);
  this.getActivitiesInCategory = (category) =>
    browser.queryAll(`[data-test="category-${category}"] li span`).map(x => x.innerHTML.trim());
  this.getCategoryDescription = category =>
    browser.text(`[data-test="category-${category}"] p`);
  this.isCategoryDescriptionVisible = category =>
    !browser.query(`[data-test="category-${category}"] [data-test="details"]`)
    .className.split(/\s+/).includes('js-hidden');
  this.expandCategory = category =>
    browser.click(`[data-test="category-${category}"] [data-test="details-button"]`);
};

module.exports = SortedActivitiesPage;
