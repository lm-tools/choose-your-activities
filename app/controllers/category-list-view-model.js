const i18n = require('i18n');

module.exports = class CategoryListViewModel {

  constructor(categories) {
    this.categories = this.categoryListView(categories);
  }

  categoryListView(categories) {
    return categories
      .map((category) => Object.assign(
        {
          // eslint-disable-next-line no-underscore-dangle
          title: i18n.__(`category.${category}.title`),
          name: category,
        }));
  }
};
