const underTest = require('../../../app/middleware/error-handler');
const i18n = require('i18n');
const enLocale = require('../../../app/locales/en');
const { expect } = require('chai');

describe('error handling', () => {
  let err;
  let req;
  let res;
  let next;

  beforeEach(() => {
    err = {};
    req = {};
    res = {};
    next = {};
  });

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
    let actualCode = {};
    err = { isJoi: true };
    res = {
      status: code => (actualCode = code),
      render: () => {
      },
    };

    underTest(false)(err, req, res, next);

    expect(actualCode).to.eql(400);
  });

  it('if not validation error then status code is set to 500', () => {
    let actualCode = {};
    res = {
      status: code => (actualCode = code),
      render: () => {
      },
    };

    underTest(false)(err, req, res, next);

    expect(actualCode).to.eql(500);
  });

  describe('creates the response', () => {
    it('renders the page on the response', () => {
      let actualView = {};
      let actualModel = {};
      res = {
        status: () => {
        },
        render: (view, model) => {
          actualView = view;
          actualModel = model;
        },
      };

      underTest(false)(err, req, res, next);

      expect(actualView).to.eql('error');
      expect(actualModel).to.eql({ message: 'We\'re experiencing technical problems.' });
    });

    [400, 404, 500].forEach(statusCode => {
      it(`sets the message for ${statusCode} status code`, () => {
        let actualModel = {};
        err = { status: statusCode };
        res = {
          status: () => {
          },
          render: (view, model) => {
            actualModel = model;
          },
        };

        underTest(false)(err, req, res, next);

        expect(actualModel).to.eql({ message: enLocale.error[statusCode] });
      });
    });

    it('if display raw error then sets the error details on the model', () => {
      let actualModel = {};
      err = { status: 404, message: 'some message', stack: 'some stack' };
      res = {
        status: () => {
        },
        render: (view, model) => {
          actualModel = model;
        },
      };

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
