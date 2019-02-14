const UnsortedActivitiesPage = function UnsortedActivitiesPage(browser, basePath) {
  this.browser = browser;
  this.basePath = basePath;

  function activityModel(x) {
    return {
      title: x.innerHTML,
      url: x.href,
    };
  }

  this.activityList = () => browser.queryAll('[data-test-activity] a').map(activityModel);
  this.visit = (version, accountId, activity) =>
    this.browser
      .visit(`${basePath}/${version}/${accountId}/activities/unsorted${activity
        ? `?sorted=${activity.name}`
        : ''}`);
  this.visitWithoutVersion = (accountId, activity) =>
    this.browser
      .visit(`${basePath}/${accountId}/activities/unsorted${activity
        ? `?sorted=${activity.name}`
        : ''}`);
  this.browserPath = () => browser.location.pathname;
  this.isContinueButtonDisplayed = () => !!browser.query('[data-test="continue-button"]');
  this.clickContinue = () => browser.click('[data-test="continue-button"]');
  this.alertMessage = () => browser.query('.alert--success').textContent.trim();
};

module.exports = UnsortedActivitiesPage;
