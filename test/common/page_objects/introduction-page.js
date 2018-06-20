const IntroductionPage = function IntroductionPage(browser, basePath) {
  this.browser = browser;
  this.basePath = basePath;

  this.visitBasePath = (path = '') => this.browser.visit(`${this.basePath}/${path}`);
  this.visit = (version, accountId) =>
    this.browser.visit(`${this.basePath}/${version}/${accountId}/introduction`);
  this.clickContinue = () => this.browser.click('[data-test="continue"]');
  this.browserPath = () => browser.location.pathname;
  this.pathParams = () => this.browserPath().replace(this.basePath, '').split('/');
};

module.exports = IntroductionPage;
