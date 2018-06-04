const underTest = require('../../../app/middleware/error-handler');
const i18n = require('i18n');
const enLocale = require('../../../app/locales/en');
const expect = require('chai').expect;

describe('error handling', () => {
  before(() =>
    i18n.configure({
      locales: ['en'],
      directory: `${__dirname}/../../../app/locales`,
      defaultLocale: 'en',
      autoReload: true,
      objectNotation: true,
      useCookie: false,
      updateFiles: true,
      indent: '  ',
    })
  );

  it('if validation error then status is set to 400', () => {
    let actualCode;
    const err = { isJoi: true };
    const req = {};
    const res = {
      status: code => (actualCode = code),
      render: () => {
      },
    };
    const next = {};

    underTest(false)(err, req, res, next);

    expect(actualCode).to.eql(400);
  });

  it('if not validation error then status code is set to 500', () => {
    let actualCode;
    const err = {};
    const req = {};
    const res = {
      status: code => (actualCode = code),
      render: () => {
      },
    };
    const next = {};

    underTest(false)(err, req, res, next);

    expect(actualCode).to.eql(500);
  });

  describe('creates the response', () => {
    it('renders the page on the response', () => {
      let actualView;
      let actualModel;
      const err = {};
      const req = {};
      const res = {
        status: () => {
        },
        render: (view, model) => {
          actualView = view;
          actualModel = model;
        },
      };
      const next = {};

      underTest(false)(err, req, res, next);

      expect(actualView).to.eql('error');
      expect(actualModel).to.eql({ message: 'We\'re experiencing technical problems.' });
    });

    [400, 404, 500].forEach(statusCode => {
      it(`sets the message for ${statusCode} status code`, () => {
        let actualModel;
        const err = { status: statusCode };
        const req = {};
        const res = {
          status: () => {
          },
          render: (view, model) => {
            actualModel = model;
          },
        };
        const next = {};

        underTest(false)(err, req, res, next);

        expect(actualModel).to.eql({ message: enLocale.error[statusCode] });
      });
    });

    it('if display raw error then sets the error details on the model', () => {
      let actualModel;
      const err = { status: 404, message: 'some message', stack: 'some stack' };
      const req = {};
      const res = {
        status: () => {
        },
        render: (view, model) => {
          actualModel = model;
        },
      };
      const next = {};

      underTest(true)(err, req, res, next);

      expect(actualModel).to.eql({
        error: {
          message: 'some message',
          stack: 'some stack',
          status: 404,
        },
        message: 'Page not found',
      });
    });
  });
});
