const CategoryView = require('./category-view-model');
const categoriesForVersion = require('../controllers/category-mapping');
const activityDecorator = require('../locales/activity-decorator');

module.exports = class SmartAnswersViewModel {
  constructor(groupedActivities, version) {
    const categoryView = new CategoryView(categoriesForVersion(version));
    this.categoryGroups = categoryView.categories
      .filter(category => !!groupedActivities[category.name])
      .map(category =>
        ({
          categoryTitle: category.title,
          categoryName: category.name,
          sortedActivities: groupedActivities[category.name]
            .map(activityDecorator)
            .map(activity => ({
              activityTitle: activity.title, activityName: activity.activity,
            })),
        }));
    this.hasCategorisedActivities = this.categoryGroups.length > 0;
  }
};
