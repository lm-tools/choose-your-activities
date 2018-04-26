class CookiePage {
  constructor(browser, basePath) {
    this.browser = browser;
    this.basePath = basePath;
  }

  visit(accountId) {
    return accountId ? this.browser.visit(`${this.basePath}/${accountId}/cookie`)
      : this.browser.visit(`${this.basePath}/cookie`);
  }

  isDisplayed() {
    return !!this.browser.text('[data-test="cookie-title"]');
  }

}

module.exports = CookiePage;
