const i18n = require('i18n');
const categoriesModel = require('../models/categories');

module.exports = class CategoryViewModel {

  constructor() {
    this.categories = this.categoryView(categoriesModel);
  }

  categoryView(categories) {
    return categories
      .map((category) => Object.assign(
        {
          // eslint-disable-next-line no-underscore-dangle
          title: i18n.__(`category.${category}.title`),
          name: category,
        }));
  }
};
