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

  getCategoryHeading() {
    return this.browser.text('[data-test=category-heading]');
  }

  getTextForListItemNumber(number) {
    const categoryContentsArray =
      Array.from(this.browser.querySelectorAll('li.app-c-contents-list__list-item'));
    const selectedCategoryListItem = categoryContentsArray[number];
    const childNodes = selectedCategoryListItem.childNodes;
    const text = childNodes[0].textContent;
    return text.replace(' ', '').trim();
  }

  getCategoryContentsTextAsList() {
    const categoryContentsArray =
      Array.from(this.browser.querySelectorAll('li.app-c-contents-list__list-item'));

    return categoryContentsArray.map(contents => {
      const childNodes = contents.childNodes;
      let textToReturn;
      if (childNodes.length === 3) {
        const linkNodes = childNodes[1].childNodes;
        const textOfLink = linkNodes[0];
        // add fake link for asserting
        textToReturn = '<a>'.concat(textOfLink.textContent.trim(), '</a>');
      } else {
        const text = childNodes[0].textContent;
        textToReturn = text.trim();
      }
      return textToReturn;
    });
  }

  clickContentsLinkForCategory(category) {
    return this.browser.clickLink(`a.app-c-contents-list__link[href="?cat=${category}"]`);
  }

  backButtonDisplayed() {
    return !!this.browser.query('[class="link-back"]');
  }
}

module.exports = ChosenActivitiesPage;
