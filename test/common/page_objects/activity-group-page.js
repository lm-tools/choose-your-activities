const ActivityGroupPage = function ActivityGroupPage(browser, basePath) {
  this.browser = browser;
  this.basePath = basePath;

  function activityGroupModel(x) {
    return {
      count: browser.query('[class="category-list__activities-count"]', x).innerHTML,
      title: browser.query('[class="category-list__description"]', x).innerHTML,
    };
  }

  this.groupList = () => browser.queryAll('[data-test-group] a')
    .map(x => activityGroupModel(x));
  this.visit = (version, accountId) =>
    this.browser.visit(`${basePath}/${version}/${accountId}/groups`);
  this.browserPath = () => browser.location.pathname;
  this.backButtonDisplayed = () => !!this.browser.query('[class="link-back"]');
};

module.exports = ActivityGroupPage;
