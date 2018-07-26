// eslint-disable-next-line no-unused-vars
const helper = require('../integration/support/integrationSpecHelper');
const SmartAnswersViewModel = require('../../app/view-models/smart-answers-view-model');

const expect = require('chai').expect;
const uuid = require('uuid');

const accountId = uuid.v4();

describe('smart answers view model', () => {
  [
    {
      text: 'should group and expand the details for all categories',
      entity: {
        READY: [
          { accountId, activity: 'ACT-1', category: 'READY' },
          { accountId, activity: 'ACT-2', category: 'READY' },
        ],
        HELP: [
          { accountId, activity: 'ACT-3', category: 'HELP' },
          { accountId, activity: 'ACT-4', category: 'HELP' },
        ],
        DOING: [
          { accountId, activity: 'ACT-5', category: 'DOING' },
          { accountId, activity: 'ACT-6', category: 'DOING' },
        ],
        'NOT-SUITABLE': [
          { accountId, activity: 'ACT-7', category: 'NOT-SUITABLE' },
          { accountId, activity: 'ACT-8', category: 'NOT-SUITABLE' },
        ],
      },
      expectResult: {
        categoryGroups: [
          {
            categoryName: 'READY',
            categoryTitle: 'I\'m ready to try this',
            sortedActivities: [
              {
                activityName: 'ACT-1',
                activityTitle: 'Find out about volunteering',
              },
              {
                activityName: 'ACT-2',
                activityTitle: 'Ask about work experience',
              },
            ],
          },
          {
            categoryName: 'HELP',
            categoryTitle: 'I\'d like help trying this',
            sortedActivities: [
              {
                activityName: 'ACT-3',
                activityTitle: 'Get advice from an expert in your industry',
              },
              {
                activityName: 'ACT-4',
                activityTitle: 'Build a list of companies you want to work for',
              },
            ],
          },
          {
            categoryName: 'DOING',
            categoryTitle: 'I\'m already doing this',
            sortedActivities: [
              {
                activityName: 'ACT-5',
                activityTitle: 'Find the right recruitment agency for you',
              },
              {
                activityName: 'ACT-6',
                activityTitle: 'Figure out your local public transport options – ' +
                'see how far you can get in an hour or 90 minutes',
              },
            ],
          },
          {
            categoryName: 'NOT-SUITABLE',
            categoryTitle: 'It doesn\'t suit me',
            sortedActivities: [
              {
                activityName: 'ACT-7',
                activityTitle: 'Find out what makes a good job application',
              },
              {
                activityName: 'ACT-8',
                activityTitle: 'Write down what you learnt last time you applied for a job',
              },
            ],
          },
        ],
        hasCategorisedActivities: true,
      },
    },
    {
      text: 'should set hidden flag set if input is empty',
      entity: {},
      expectResult: { categoryGroups: [], hasCategorisedActivities: false },
    },
  ].forEach((scenario) => {
    it(scenario.text, () => {
      const smartAnswersViewModel = new SmartAnswersViewModel(scenario.entity);
      expect(smartAnswersViewModel).to.eql(scenario.expectResult);
    });
  });
});
