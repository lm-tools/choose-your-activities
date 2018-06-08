class ChosenActivitiesPage {

  constructor(browser, basePath) {
    this.browser = browser;
    this.basePath = basePath;
  }

  visitWithCategory(version, accountId, groupId, category) {
    return this.browser.visit(
      `${this.basePath}/${version}/${accountId}/groups/${groupId}/activities/chosen?cat=${category}`
    );
  }

  visit(version, accountId, groupId) {
    return this.browser.visit(
      `${this.basePath}/${version}/${accountId}/groups/${groupId}/activities/chosen`
    );
  }

  getTitle() {
    return this.browser.text('title');
  }

  getHeading() {
    const headingText = this.browser.text('h1.heading-xlarge');
    const subHeadingText = this.browser.text('h1 .heading-secondary');
    return { headingText: headingText.replace(subHeadingText, '').trim(), subHeadingText };
  }

  getCategoryContents() {
    return Array.from(this.browser.querySelectorAll('li.app-c-contents-list__list-item'));
  }

  getTextForListItemNumber(number) {
    const categoryContentsArray =
      Array.from(this.browser.querySelectorAll('li.app-c-contents-list__list-item'));
    const selectedCategoryListItem = categoryContentsArray[number];
    const childNodes = selectedCategoryListItem.childNodes;
    const text = childNodes[0].textContent;
    return text.replace(' ', '').trim();
  }

}

module.exports = ChosenActivitiesPage;
