class SortedActivitiesBasePage {
  constructor(browser, basePath) {
    this.browser = browser;
    this.basePath = basePath;
  }

  activityList() {
    return this.browser.queryAll('[data-test="title"]');
  }

  browserPath() {
    return this.browser.location.pathname;
  }

  activityCategories() {
    return this.browser.queryAll('[data-test="category"]').map(x => x.innerHTML);
  }

  getActivitiesInCategory(category) {
    return this.browser.queryAll(`[data-test="category-${category}"] li p`)
      .map(x => x.innerHTML.trim());
  }

  getCategoryDescription(category) {
    return this.browser.text(`[data-test="category-${category}"] [data-test="empty-message"]`);
  }

  isCategoryDescriptionVisible(category) {
    return !this.browser.query(`[data-test="category-${category}"] [data-test="details"]`)
      .className.split(/\s+/).includes('js-hidden');
  }

  isMoveButtonDisplayed(activity) {
    return !!this.browser.query(`[data-test="activity-${activity.name}-move"]`);
  }

  getOpenCategory(category) {
    return this.browser.query(`[data-test="category-${category}"] .expand-help--is-expanded`);
  }

  clickDetailsButton(activity) {
    return this.browser.click(`[data-test="activity-${activity.name}"] 
    [data-test="details-button"]`);
  }

  getCategorySummary(category) {
    return this.browser.text(`[data-test="category-${category}"] [data-test="show-hide-text"]`);
  }

  isCategoryExpanded(category) {
    return this.browser.query(`[data-test="category-${category}"] .expand-help`)
      .classList.contains('expand-help--is-expanded');
  }

  isNavigationDisplayed() {
    return !!this.browser.query('[data-test="navigation"]');
  }

}

module.exports = SortedActivitiesBasePage;
